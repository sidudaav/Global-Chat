$(document).ready(() => {
    let socket = io()

    $('form').submit(function(e){
        e.preventDefault();
        const msg = $('#txt').val()
        $('#txt').css('border-color', 'black')
        $('#txt').val('');

        if (msg.length > 100 || msg.length < 2) {
            $('#txt').attr("placeholder", 'Keep your messages between 2 and 100 characters')
            $('#txt').css('border-color', 'red')

            return false
        }
    
        socket.emit('change', {
            msg: msg
        })
    });

    let scrolled = false;
    const updateScroll = () => {
        if(!scrolled){
            let messages = document.getElementById('messages')
            messages.scrollTop = messages.scrollHeight;
        }
    }

    setInterval(updateScroll, 100);

    let id
    socket.on('connected', data => {
        id = data.id
    })

    socket.on('changedTotalSockets', data => {
        console.log(data)
        $('#connectedUsers').text(data.connected)
    })
    
    socket.on('message', data => {
        data.class = data.id === id ? "user-message" : "message"

        $('#messages').append(
            `<li class=${data.class}>${data.msg}</li>`
        )
    })
})