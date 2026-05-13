import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  parseExpiresInToMilliSeconds,
} from "../configs/config.js";

export const userRoles = Object.freeze({
  values: {
    FOODIE: "foodie",
    CHEF: "chef",
    ADMIN: "admin",
  },

  isValid(value: string) {
    return Object.values(this.values).includes(value);
  },
});

export enum EUserRole {
  FOODIE = "foodie",
  CHEF = "chef",
  ADMIN = "admin",
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: EUserRole;
  password: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  socials?: {
    platform: string;
    url: string;
  }[];
  banner?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserWithMethods extends IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): { token: string; config: CookieOptions };
}

const userSchema = new mongoose.Schema<IUserWithMethods>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: EUserRole,
      default: EUserRole.FOODIE,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "No bio",
    },
    socials: {
      type: [
        {
          platform: {
            type: String,
            maxlength: [30, "Social media platform name cannot be more than 30 characters"],
          },
          url: {
            type: String,
            match: [/^https?:\/\/.+\..+$/, "Please provide a valid URL"],
          },
        },
      ],
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    JWT_ACCESS_SECRET as jwt.Secret,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    } as jwt.SignOptions,
  );
};

userSchema.methods.generateRefreshToken = function () {
  const config: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: parseExpiresInToMilliSeconds(JWT_REFRESH_EXPIRES_IN),
  };
  return {
    token: jwt.sign(
      {
        id: this._id,
      },
      JWT_REFRESH_SECRET as jwt.Secret,
      {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
      } as jwt.SignOptions,
    ),
    config,
  };
};

const User = mongoose.model("User", userSchema);
export default User;
