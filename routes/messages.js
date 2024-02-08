const router = require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const {check, validationResult} = require("express-validator");

/** 1ページあたりの最大メッセージ数 */
const pageSize = 5;

/**
 * ログインチェック処理をするミドルウェア
 */
const loginCheck = (req, res, next) => {
    if (!req.user) {
        req.session.returnTo = "/boards";
        res.redirect("/users/login");
        return;
    }
    next();
};

/**
 * メッセージ一覧ページ
 */
router.get("/:page?", loginCheck, async (req, res, next) => {
    // ページ番号をパラメータから取る。なければデフォルトは 1
    const page = +req.params.page || 1;
    // メッセージ取ってくる
    const messages = await prisma.message.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [
            {createdAt: "desc"}
        ],
        include: {
            account: true
        }
    });
    const data = {
        title: "Boards",
        user: req.user,
        content: messages,
        page
    };
    res.render("boards/index", data);
});

/**
 * メッセージの新規登録
 */
router.post("/add",
    loginCheck,
    check("message").notEmpty({ignore_whitespace: true}),
    async (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            // 入力値に問題がなければ登録処理。問題があれば何もしない。
            await prisma.message.create({
                data: {
                    accountId: req.user.id,
                    text: req.body.message
                }
            });
        }
        // post(/boards/add)ではレスポンスは返さないのでリダイレクト
        res.redirect("/boards/1");
    }
);

/**
 * 特定のユーザのみのメッセージ一覧を表示する
 */
router.get("/home/:uid/:page?", loginCheck, async (req, res, next) => {
    const uid = +req.params.uid;
    const page = +req.params.page || 1;
    // ユーザID(uid)とページ番号(page)を使ってデータ取ってくる。
    const messages = await prisma.message.findMany({
        where: {accountId: uid},
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [
            {createdAt: "desc"}
        ]
    });
    // ターゲットのユーザ情報を取ってくる
    const target = await prisma.user.findUnique({
        where: {id: uid},
        select: {
            id: true,
            name: true
        }
    });
    const data = {
        title: "Boards",
        user: req.user,
        target,
        content: messages,
        page,
    };
    res.render("boards/home", data);
});

module.exports = router;