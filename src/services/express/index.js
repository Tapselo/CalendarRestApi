const express = require('express');

const expressConfig = (apiRoot, routes) => {
  const app = express();

  app.use(express.json());
  app.use(apiRoot, routes);

  // 404 Error handler
  app.use((req, res, next) =>  res.status(404).send({error: 'Routing not found'}));

  // 403 Error handler
  app.use( (err,req,res,next) => res.status(403).json({'error':"Forbidden action",'details': err.message}));

  // 401 Error handler
  app.use( (err,req,res,next) => res.status(401).send({'error':"Unauthorized error",'details': err.message}));

  // 400 Error handler
  app.use((err, req, res, next) =>  {
    console.error(err.message);
    if(err.name === 'CastError')
        return res.status(400).end();
    if(err.name === 'ValidationError')
      return res.status(400).json({error: err.message});
    return res.status(500).end();
  });

  return app
};

module.exports = expressConfig;
