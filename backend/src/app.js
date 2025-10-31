const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const { notFound, handleError } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', exposedHeaders: ['X-Total-Count'] }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running',
    endpoints: {
      items: '/api/items',
      stats: '/api/stats'
    }
  });
});

app.use('/api/items', itemsRouter);
app.use('/api/stats', statsRouter);

app.use('*', notFound);
app.use(handleError);

module.exports = app;


