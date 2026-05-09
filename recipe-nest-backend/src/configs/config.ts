import 'dotenv/config';

export const PORT: string = process.env.PORT as string;
export const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

export const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET as string;
export const JWT_ACCESS_EXPIRES_IN: string = process.env.JWT_ACCESS_EXPIRES_IN as string;
export const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET as string;
export const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN as string;

export const parseExpiresInToMilliSeconds = (input: string) => {
  const value = parseInt(input);
  const unit = input.slice(-1).toLowerCase();

    switch (unit) {
      case "d":
        return value * 24 * 60 * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "m":
        return value * 60 * 1000;
      case "s":
        return value * 1000;
      default:
        return value * 1000; // Assume seconds if no unit
    }
  }

export const DB_URL: string = process.env.DB_URL as string;

export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY as string;
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET as string;

