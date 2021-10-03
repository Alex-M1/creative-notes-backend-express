import mongoose from 'mongoose';
import { Server } from 'http';
import { Socket } from '@src/controllers/Socket/Socket.controller';

export const connect = async (app: Server): Promise<void> => {
  const url = process.env.MONGO_URL;
  const PORT = process.env.PORT;
  await mongoose.connect(url, {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
    // useCreateIndex: true,

  });
  app.listen(
    PORT,
    () => console.log(`Server has been started on port ${PORT}`),
  );
  new Socket().connect(app);
};
