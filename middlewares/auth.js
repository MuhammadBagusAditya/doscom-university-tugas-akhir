import passport from "@utils/passport";

export default passport.authenticate("jwt", {
  session: false,
  failWithError: true,
});
