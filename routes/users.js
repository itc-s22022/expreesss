import { Router } from "express";
import passport from "passport";

const router = Router();


// ログイン状態の確認
router.get("/", (req, res, next) => {
    // ログインしているかどうかをチェック
    if (req.isAuthenticated()) {
        // ログインしている場合はステータスコード200と"logged in"メッセージを返す
        res.status(200).json({ message: "logged in" });
    } else {
        // ログインしていない場合はステータスコード401と"unauthenticated"メッセージを返す
        res.status(401).json({ message: "unauthenticated" });
    }
});


//ログイン
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/users/error",
    failureMessage: true,
    keepSessionInfo: true
}),(req, res, next) => {
    // 成功したとき
    res.json({message: "OK!"})
});
//　失敗したとき
router.get("/error", (req, res, next) => {
    res.status(401).json({message: "name and/or password is invalid"})
});

// ログアウト
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

export default router;
