const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('ChessDB', 'postgres', 'Admin', {
    host: 'localhost',
    dialect: 'postgres'
});

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['username']
        }
    ]
});

class Room extends Model {}

Room.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    player1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    player2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    players: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Room',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ]
});

class Game extends Model {}

Game.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roomID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'id'
        }
    },
    white: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    black: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    moves: {
        type: DataTypes.JSON,
        allowNull: true
    },
    board: {
        type: DataTypes.JSON,
        allowNull: true
    },
    kills: {
        type: DataTypes.JSON,
        allowNull: true
    },
    turn: {
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull: false
    },
    winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Game',
    timestamps: false,
    indexes: [
        {
            fields: ['roomID']
        }
    ]
});

sequelize.sync({ force: true })