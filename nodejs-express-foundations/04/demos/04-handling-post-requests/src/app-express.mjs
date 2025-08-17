import express from 'express'
import { join } from 'node:path'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(express.static(join(process.cwd(), 'src', 'public')))

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
  response.status(200).render('concerts', { concerts: concert_data.concerts })
})

function findConcertById(concerts, concert_id) {
  for (let i = 0; i < concerts.length; i++) {
    const concert = concerts[i]
    if (concert.concert_id === concert_id) {
      return concert
    }
  }
  return null
}

app.get('/concerts/:concert_id', (request, response) => {
  const concert_id = parseInt(request.params.concert_id)
  const concert_object = findConcertById(concert_data.concerts, concert_id)

  response.status(200).render('concert', { concert_info: concert_object })
})

app.post('/save_to_cart', (request, response) => {
  let body = '';

  request.on('data', chunk => {
    body += chunk.toString();
  });

  request.on('end', () => {
    const parsedBody = JSON.parse(body);
    
    let concert_id = parsedBody.concert_id
    let concert_artist = parsedBody.concert_artist
    let concert_price = parsedBody.concert_price
    let concert_currency = parsedBody.concert_currency

    let cart
    if(request.cookies.cart === undefined) {
      cart = []
    } else {
      cart = JSON.parse(request.cookies.cart)
    }
    cart.push({ concert_id, concert_artist, concert_price, concert_currency })

    response.cookie('cart', JSON.stringify(cart))
    response.status(200).send()
  })
})

app.listen(3000)