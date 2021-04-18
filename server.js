const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


app.get('/', (req, resp) => {
    resp.render('index.html')
})


let messages = []

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    socket.emit('previousMessage', messages)

    socket.on('sendMessage', data => {
        messages.push(data)

        socket.broadcast.emit('receivedMessage', data)
    })
})

const port = 3000
server.listen(port, () => {
    console.log(`Escutando na porta ${port}`)
})