

export default function handler(req,res){
    if (res.socket.server.io) {
        console.log("testing chat")
        const message = req.body;
        // dispatch to channel "message"
        const io= res.socket.server.io
        io.emit('test emit',message)
        // return message
        res.status(201).json(message);
      }
}