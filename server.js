const express = require('express')
const server = express()
const morgan = require('morgan')

server.use(express.json())
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
server.use(morgan(':method :url :status :response-time ms - :res[content-length] :type'))

const data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

server.get('/api/persons',(req,res)=>{
    res.json(data)
})

server.get('/info',(req,res)=>{
    res.send(`
        <div>
            <p>phonebook has info for ${data.length} people</p>
            <p>${new Date()}</p>
        </div>
    `)
})

server.get('/api/persons/:id', (req,res)=>{
    try{
        const person = data[req.params.id-1]
        if(!person) throw new Error('id not fount')
        res.json({data:person, message:"person found successfully"})
    }catch(e){
        res.status(404).json({message:`person with id ${req.params.id} couldn't be found`})
    }
})

server.delete('/api/persons/:id',(req,res)=>{
    try{
        const person = data[req.params.id-1]
        if(!person) throw new Error('id not fount')
        data.splice(req.params.id-1,1)
        res.status(204).end()
    }catch{
        res.status(404).json({message:`person with id ${req.params.id} couldn't be found`})
    }
})

server.post('/api/persons',(req,res)=>{
    try{
        if(!req.body.name || !req.body.number) throw new Error('missing information')
        data.forEach(elem=>{
            if (elem.name===req.body.name) throw new Error('duplicate name')
        })
        const newId = Math.floor(Math.random()*1000000)
        const newPerson = {id:newId,...req.body}
        data.push(newPerson)
        res.status(201).json({data:newPerson,message:'person created successfully'})
    }catch(e){
        if(e.message==='missing information') res.status(422).json({message:'no field can be empty'})
        if(e.message==='duplicate name') res.status(409).json({message:`this name ${req.body.name} already exists`})
    }
    
})

server.listen(process.env.PORT||3001,()=>console.log('listening on port 3001...'))