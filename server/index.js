// import express from 'express';
// import path from 'path';

const express = require('express');
const path = require('path');

const server = express();
const PORT = process.env.PORT || 3000

server.use(express.static(path.join(__dirname, '../client/public')));
server.get('/Logo/:file', (req, res) => res.sendFile(path.resolve(__dirname, '../client/src/components/globals/Logo/', req.params.file)));
server.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/public/index.html')));

server.listen(PORT, () => console.log('serving static files on port ', PORT));
