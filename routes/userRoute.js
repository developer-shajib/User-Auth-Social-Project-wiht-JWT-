import express from "express";
import {
  deleteGallerySinglePhoto,
  deleteProfilePhoto,
  editPage,
  editPageData,
  fineFriendsPage,
  followUser,
  forgetEmailRequest,
  forgetEmailRequestPost,
  forgetPassPage,
  forgetPassPost,
  forgetTokenVerify,
  friendFollowers,
  getGalleryPage,
  loginPage,
  loginUser,
  logoutUser,
  myFollowers,
  myFollowing,
  passwordPage,
  profileChangePass,
  profilePage,
  profilePhotoPage,
  profilePhotoUpdate,
  registerPage,
  registerUser,
  resendEmail,
  unfollowUser,
  uploadGalleryPhoto,
  userAccountActivation,
  userProfileData,
} from "../controller/userController.js";
import { guestMiddleware } from "../middleware/authMiddleware.js";
import { authRedirectMiddleware } from "../middleware/authRedirectMiddleware.js";
import {
  galleryPhotoMulter,
  profilePhotoMulter,
} from "../middleware/multer.js";

//init router
const router = express.Router();

//create routing
router.route("/").get(authRedirectMiddleware, profilePage);

//profile photo page
router.route("/photo-update").get(authRedirectMiddleware, profilePhotoPage);
router.route("/photo-update").post(profilePhotoMulter, profilePhotoUpdate);
router.route("/delete-photo").get(authRedirectMiddleware, deleteProfilePhoto);

//gallery page
router.route("/gallery").get(authRedirectMiddleware, getGalleryPage);
router.route("/gallery").post(galleryPhotoMulter, uploadGalleryPhoto);

//password change page
router.route("/password").get(authRedirectMiddleware, passwordPage);
router.route("/password").post(profileChangePass);

//forget password email request
router.route("/forget-email-send").get(forgetEmailRequest);
router.route("/forget-email-send").post(forgetEmailRequestPost);

//forget password change
router.route("/forget-password").get(forgetPassPage);
router.route("/forget-password").post(forgetPassPost);

//profile edit page
router.route("/profile-edit").get(authRedirectMiddleware, editPage);
router.route("/profile-edit").post(editPageData);

// get login register
router.route("/login").get(guestMiddleware, loginPage);
router.route("/register").get(guestMiddleware, registerPage);

//post login request
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//logout
router.route("/logout").get(logoutUser);

//resend email
router.route("/resend").get(resendEmail);

//find friends
router.route("/find-friends").get(authRedirectMiddleware, fineFriendsPage);

//my follower
router.route("/my-followers").get(authRedirectMiddleware, myFollowers);
//my following
router.route("/my-following").get(authRedirectMiddleware, myFollowing);


//follow
router.route("/follow/:id").get(authRedirectMiddleware, followUser);
//unfollow
router.route('/unfollow/:id').get(authRedirectMiddleware, unfollowUser);

//gallery photo delete
router.route("/gallery/:id").get(authRedirectMiddleware, deleteGallerySinglePhoto);

//account activate link
router.route("/activate/:token").get(userAccountActivation);

// forget email token link
router.route("/forgetToken/:token").get(forgetTokenVerify);

//friend profile
router.route("/:id").get(authRedirectMiddleware, userProfileData);

//friend follower
router.route("/:id/friend-followers").get(authRedirectMiddleware, friendFollowers);



//export router
export default router;
