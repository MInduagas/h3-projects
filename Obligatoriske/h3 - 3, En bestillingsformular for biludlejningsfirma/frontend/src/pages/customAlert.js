const customAlert = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.className = 'custom-alert';
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      document.body.removeChild(alertDiv);
    }, 3000);

    const test = () => {
        console.log('test');
    }
}

export default customAlert;