require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).send(
        { mensagem: 'Tarefa executada com sucesso!'});
})

app.post('/executar-tarefa', (req, res) => {
    console.log('Tarefa executada!');
    res.status(200).send(
        { mensagem: 'Tarefa executada com sucesso!', data: req.body });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
