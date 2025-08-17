import express from 'express'
import { join } from 'node:path'
import cookieParser from 'cookie-parser'
import { createLogger, format, transports } from 'winston'

const app = express()

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app-express.log' })
  ]
})

const logAll = function(request, response, next) {
  logger.info(`URL being requested: ${request.url}`)
  next()
}

app.use(express.json())
app.use(cookieParser())
app.use(express.static(join(process.cwd(), 'src', 'public')))
app.use(logAll)

app.set('view engine', 'ejs')
app.set('views', './src/public/views')

const concert_data = {
  "concerts": [
    {
      "concert_id": 1,
      "concert_artist": "Alexander Lemtov",
      "concert_description": "Join Alexander on his global tour.  Alexander really needs no introduction since he has already mesmerized the world with his electronic ambient sound.",
      "concert_price": "65",
      "concert_date": "9/2/2024",
      "concert_time": "11:00 PM",
      "concert_image": "/img/shutterstock_415922566_thumbnail_1.jpg"
    },
    {
      "concert_id": 2,
      "concert_artist": "Santiago Martinez",
      "concert_description": "Experience the magic of Santiago Martinez live . Santiago’s groundbreaking blend of traditional and contemporary sounds has enchanted audiences everywhere.",
      "concert_price": "135",
      "concert_date": "9/24/2024",
      "concert_time": "8:00 PM",
      "concert_image": "/img/shutterstock_606456248_thumbnail_2.jpg"
    },
    {
      "concert_id": 3,
      "concert_artist": "Miriam Johnson",
      "concert_description": "Don’t miss Miriam Johnson as she tours the world, bringing her soulful voice and heartfelt lyrics to life. Miriam has already touched hearts globally with her powerful and emotive performances.",
      "concert_price": "85",
      "concert_date": "10/4/2024",
      "concert_time": "7:00pm PM",
      "concert_image": "/img/shutterstock_1746589040_thumbnail_3.jpg"
    },
  ]
}

app.get('/concerts/', (request, response) => {
  try {
    response.status(200).render('concerts', { concerts: concert_data.concerts })
  } catch (error) {
    console.error(error.stack)
    response.status(500).send(`Internal server error`)
  }
})

function findConcertById(concerts, concert_id) {
  if (!Array.isArray(concerts)) {
    throw new Error(`The concerts variable is not an array`)
  }

  if (concert_id === undefined || concert_id === null) {
    throw new Error(`The concert_id parameter is undefined or null`)
  }
  for (let i = 0; i < concerts.length; i++) {
    const concert = concerts[i]
    if (concert.concert_id === concert_id) {
      return concert
    }
  }
  return null
}

app.get('/concerts/:concert_id', (request, response) => {
  try {
    const concert_id = parseInt(request.params.concert_id)
    const concert_object = findConcertById(concert_data.concerts, concert_id)

    if(!concert_object) {
      return response.status(404).send(`Concert not found`)
    }

    response.status(200).render('concert', { concert_info: concert_object })
  } catch (error) {
    response.status(500).send(`Internal server error`)
  }
})

const validateBody = (request, response, next) => {
  try {
    let concert_id = request.body.concert_id
    let concert_artist = request.body.concert_artist
    let concert_price = request.body.concert_price
    let concert_currency = request.body.concert_currency

    if(!concert_id || !concert_artist || !concert_price || !concert_currency) {
      console.log(`Missing required field(s).`)
      return response.status(400).send(`Missing required field(s)`)
    }
  } catch (error) {
    return response.status(500).send(`Internal Server Error`);
  }
  next()
}

app.post('/save_to_cart', validateBody, (request, response) => {
  try {
    let concert_id = request.body.concert_id
    let concert_artist = request.body.concert_artist
    let concert_price = request.body.concert_price
    let concert_currency = request.body.concert_currency

    let cart
    if(request.cookies.cart === undefined) {
      cart = []
    } else {
      cart = JSON.parse(request.cookies.cart)
    }
    cart.push({ concert_id, concert_artist, concert_price, concert_currency })

    response.cookie('cart', JSON.stringify(cart))
    response.status(200).json({ concert_id, concert_artist, concert_price, concert_currency })
  } catch (error) {
    return response.status(500).send(`Internal Server Error`);
  }
})

app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(500).send(`Something went wrong!`);
});

app.listen(3000)