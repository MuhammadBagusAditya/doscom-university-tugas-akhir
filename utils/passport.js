import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import config from "@config";
import prisma from "@utils/prisma";

/**
 * @satisfies {import("passport-jwt").StrategyOptionsWithoutRequest}
 */
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.app.secret,
};

/**
 * @satisfies {import("passport-jwt").VerifyCallback}
 */
const cb = async (payload, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      done(
        {
          status: "failed",
          message: "User tidak dikenali",
        },
        false
      );
    }

    done(null, user);
  } catch (err) {
    done(
      {
        status: "failed",
        message: "User tidak dikenali",
      },
      false
    );
  }
};

passport.use(new JwtStrategy(opts, cb));

export default passport;
