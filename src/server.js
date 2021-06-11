import app from './app';

app.listen(process.env.PORT, () => {
  console.log(`Server running in ${process.env.PORT}`);
});
