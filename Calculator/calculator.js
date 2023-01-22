const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
const port = 3000

app.get('/bmiCalculator', (req, res) => {
  res.sendFile(__dirname + '/bmiCalculator.html')
})

app.post('/bmiCalculator', (req, res) => {
  let weight = req.body.weight
  let height = req.body.height
  let bmi = weight/(height**2)
  res.send('Your BMI is  ' + bmi)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})