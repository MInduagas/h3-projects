const express = require('express');
const app = express();
const port = 5231;
const { Pool} = require('pg');

const cors = require('cors');
const bodyParser = require('body-parser');

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(`${message}`);
    });
});

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ChessDB',
    password: 'Admin',
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username.toLowerCase();
        const result = await pool.query('SELECT * FROM "Users" WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length === 0) {
            res.status(401).send('Invalid username or password');
        } else {
            const user = result.rows[0];
            delete user.password; 
            res.status(200).json(user);
        }
    } catch (error) {
        console.error(error);
    }
});

app.post('/api/register', async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username.toLowerCase();
        const result = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            res.status(400).send('Username already exists');
        } else {
            await pool.query('INSERT INTO "Users" (username, password) VALUES ($1, $2)', [username, password]);
            const newUser = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
            const user = newUser.rows[0];
            delete user.password; // remove password from the user object
            res.status(200).json(user);
        }
    } catch (error) {
        console.error(error);
    }
});

app.delete('/api/rooms', async (req, res) => {
    // delete all rooms and their games
    try {
        await pool.query('DELETE FROM "Games"');
        await pool.query('DELETE FROM "Rooms"');
        broadcast({ message: 'deleted' });
        res.status(200).send({ message: 'deleted' });
    } catch (error) {
        console.error(error);
    }
});

app.delete('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM "Rooms" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).send('Room not found');
        } else {
            await pool.query('DELETE FROM "Games" WHERE "roomID" = $1', [id]);
            await pool.query('DELETE FROM "Rooms" WHERE id = $1', [id]);
            broadcast({ message: 'deleted', id : id });
            res.status(200).send('Room deleted');
        }
    } catch (error) {
        console.error(error);
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Rooms"');
        for(let i = 0; i < result.rows.length; i++) {
            const room = result.rows[i];
            const games = await pool.query('SELECT * FROM "Games" WHERE "roomID" = $1 ORDER BY id DESC LIMIT 1', [room.id]);
            if(games.rows.length > 0)
                result.rows[i].game = games.rows[0];
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
    }
});

app.put('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { game, room } = req.body;

        const roomQuery = 'SELECT * FROM "Rooms" WHERE id = $1';
        const roomResult = await pool.query(roomQuery, [id]);

        if (roomResult.rows.length === 0) {
            return res.status(404).send('Room not found');
        }

        const updateRoomQuery = 'UPDATE "Rooms" SET name = $1, "isAvailable" = $2, "isActive" = $3 WHERE id = $4';
        const updateRoomParams = [room.name, room.isAvailable, room.isActive, room.id];
        await pool.query(updateRoomQuery, updateRoomParams);


        console.log(game)

        if (game) {
            const gameQuery = 'SELECT * FROM "Games" WHERE "roomID" = $1';
            const gameResult = await pool.query(gameQuery, [room.id]);

            if (gameResult.rows.length === 0) {
                const insertGameQuery = 'INSERT INTO "Games" ("roomID", "white", "black", "board", "moves", "kills", "turn") VALUES ($1, $2, $3, $4, $5, $6, $7)';
                const insertGameParams = [room.id, game.whitePlayer, game.blackPlayer, JSON.stringify(game.board), game.moves, game.kills, game.turn];
                await pool.query(insertGameQuery, insertGameParams);
            } else {
                const updateGameQuery = 'UPDATE "Games" SET "white" = $1, "black" = $2, "board" = $3, "moves" = $4, "kills" = $5, "turn" = $6 WHERE "roomID" = $7';
                const updateGameParams = [game.whitePlayer, game.blackPlayer, JSON.stringify(game.board), game.moves, game.kills, game.turn, room.id];
                await pool.query(updateGameQuery, updateGameParams);
            }
        }

        updatedGame = await pool.query('SELECT * FROM "Games" WHERE "roomID" = $1 ORDER BY "id" DESC LIMIT 1', [room.id]);
        room.game = updatedGame.rows[0];

        broadcast(room);

        res.status(200).send('Room updated');
    } catch (error) {
        console.error(error);
    }
});

app.put('/api/room/:id/join', async (req, res) => {
    try {
        const { id } = req.params;
        const { playerId } = req.body;

        const pId = parseInt(playerId);

        const roomResult = await pool.query('SELECT * FROM "Rooms" WHERE id = $1', [id]);
        const room = roomResult.rows[0];

        if( pId === parseInt(room.player1) || pId === parseInt(room.player2) ) {
            const updatedRoom = await pool.query('SELECT * FROM "Rooms" WHERE id = $1', [id]);
    
            const getGameQuery = 'SELECT * FROM "Games" WHERE "roomID" = $1 ORDER BY "id" DESC LIMIT 1';
            const getGameParams = [id];
            const gameResult = await pool.query(getGameQuery, getGameParams);
    
            if(gameResult.rows.length > 0) {
                updatedRoom.rows[0].game = gameResult.rows[0];
            }
            return res.status(200).send(updatedRoom.rows[0])
        }

        if (room.player1 === 0) {
            room.player1 = playerId;
            room.players += 1;
        } else if (room.player2 === 0) {
            room.player2 = playerId;
            room.players += 1;
        } else {
            return res.status(400).send({ message: 'Room is full' });
        }

        if(room.players === 2) {
            room.isAvailable = false;
            room.isActive = true;
        }

        const updateRoomQuery = 'UPDATE "Rooms" SET player1 = $1, player2 = $2, players = $3, "isAvailable" = $4, "isActive" = $5 WHERE id = $6';
        const updateRoomParams = [room.player1, room.player2, room.players, room.isAvailable, room.isActive, room.id];
        await pool.query(updateRoomQuery, updateRoomParams);

        const updatedRoom = await pool.query('SELECT * FROM "Rooms" WHERE id = $1', [id]);

        const getGameQuery = 'SELECT * FROM "Games" WHERE "roomID" = $1 ORDER BY "id" DESC LIMIT 1';
        const getGameParams = [id];
        const gameResult = await pool.query(getGameQuery, getGameParams);

        if(gameResult.rows.length > 0) {
            updatedRoom.rows[0].game = gameResult.rows[0];
        }

        broadcast(updatedRoom.rows[0]);

        res.status(200).send(updatedRoom.rows[0]);
    } catch (error) {
        
    }
});

app.get('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM "Rooms" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).send(data.error('Room not found'));
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
    }
});

app.post('/api/rooms', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await pool.query('SELECT * FROM "Rooms" WHERE name = $1', [name]);
        if (result.rows.length > 0) {
            res.status(400).send('Room already exists');
        } else {
            await pool.query('INSERT INTO "Rooms" (name, "isAvailable", "isActive") VALUES ($1,$2,$3)', [name, true, false]);
            const room = await pool.query('SELECT * FROM "Rooms" WHERE name = $1', [name]);
            broadcast(room.rows[0]);
            res.status(200).send(room.rows[0]);
        }
    } catch (error) {
        console.error(error);
    }
});

app.post('/api/game', async (req, res) => {
    try {
        const { roomId, player1, player2, moves, kills, board } = req.body;

        const lastGameResult = await pool.query('SELECT * FROM "Games" WHERE "roomID" = $1 ORDER BY "id" DESC LIMIT 1', [roomId]);
        const lastGame = lastGameResult.rows[0];

        if(lastGame && lastGame.winner === 0) {
            res.status(200).send(lastGame);
            return;
        }

        let white, black;
        if (lastGame) {
            white = lastGame.white === player1 ? player2 : player1;
            black = lastGame.white === player1 ? player1 : player2;
        } else {
            if (Math.random() < 0.5) {
                white = player1;
                black = player2;
            } else {
                white = player2;
                black = player1;
            }
        }

        const result = await pool.query('INSERT INTO "Games" ("roomID", "white", "black", "moves", "board", "kills", "turn", "winner") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [roomId, white, black, moves, JSON.stringify(board), kills, white, 0]);
        const game = result.rows[0];

        const whiteMoves = moves.white.length;
        const blackMoves = moves.black.length;
        game.turn = whiteMoves === blackMoves ? white : black;

        broadcast(game);

        res.status(200).send(game);
    } catch (error) {
        console.error(error);
    }
});

app.put('/api/game/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { moves, board, kills, turn, winner, player1, player2 } = req.body;

        turn = turn == player1 ? player2 : player1;

        console.log(req.body)

        const result = await pool.query('UPDATE "Games" SET "moves" = $1, "board" = $2, "kills" = $3, "turn" = $4, "winner" = $5 WHERE id = $6 RETURNING *', [moves, JSON.stringify(board), kills, turn, winner, id]);
        const game = result.rows[0];

        console.log(game)

        broadcast(game);

        res.status(200).json(game);
    } catch (error) {
        console.error(error);
    }
});

app.put('/api/game/win/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { winner } = req.body;
        const result = await pool.query('UPDATE "Games" SET "winner" = $1 WHERE id = $2 RETURNING *', [winner, id]);
        broadcast({winner: true});

        res.status(200)
    } catch (error) {
        console.error(error);
    }

});


app.get('/api/game/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM "Games" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).send('Game not found');
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => {
    // clear console
    console.clear();
    console.log(`Server listening at http://localhost:${port}`);
});