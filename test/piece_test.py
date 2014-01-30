#encoding=utf-8
import unittest
from model import piece

class PieceCase(unittest.TestCase):
    def setUp(self):
        pass
    def tearDown(self):
        pass

    def testNoAuthor(self):
        # 普通句子
        self.assertEqual(piece.parse_content(u"每个人的心里，有多么长的一个清单，这些清单里写着多少美好的事，可是，它们总是被推迟，被搁置，在时间的阁楼上腐烂。为什么勇气的问题总是被误以为是时间的问题，而那些沉重的、抑郁的、不得已的，总是被叫做生活本身。"),{
            "content":u"每个人的心里，有多么长的一个清单，这些清单里写着多少美好的事，可是，它们总是被推迟，被搁置，在时间的阁楼上腐烂。为什么勇气的问题总是被误以为是时间的问题，而那些沉重的、抑郁的、不得已的，总是被叫做生活本身。",
            "author":None,
            "work":None
        })

    def testPureEnglishWithOneWord(self):
        self.assertEqual(piece.parse_content(u"Mac-talk."),{
            "content":u"Mac-talk.",
            "author":None,
            "work":None
        })

    def testTooManySpliter(self):
        # 过多链接符忽略
        self.assertEqual(piece.parse_content("https://stacksocial.com/sales/the-mac-freebie-bundle-2-0"),{
            "content":"https://stacksocial.com/sales/the-mac-freebie-bundle-2-0",
            "author":None,
            "work":None
        })

    def testByIssue(self):


        self.assertEqual(piece.parse_content(u"It's better to fail than to pass by pure luck."),{
            "content":u"It's better to fail than to pass by pure luck.",
            "author":None,
            "work":None
        })

    def testAuthorSentance(self):
        self.assertEqual(piece.parse_content(u"我会唱歌我知道\n对于评审给我这样的肯定\n我也给予肯定\n----王菲，金曲獎十五屆最佳女演唱人得獎感言"),{
            "content":u"我会唱歌我知道\n对于评审给我这样的肯定\n我也给予肯定\n----王菲，金曲獎十五屆最佳女演唱人得獎感言",
            "author":None,
            "work":None
        })

    def testParseContent(self):
        """ testParseContent """
        self.assertEqual(piece.parse_content(u"愚蠢的人饱受其愚蠢所带来的疲累之苦。       by 叔本华"),{
            "content":u"愚蠢的人饱受其愚蠢所带来的疲累之苦。",
            "author":u"叔本华",
            "work":None
        })

        # 带言说者
        self.assertEqual(piece.parse_content(u"我们终将浑然一体，就像水溶于水。 \n——柴静"),{
            "content":u"我们终将浑然一体，就像水溶于水。",
            "author":u'柴静',
            "work":None
        })
        # 不规范破折 ------
        self.assertEqual(piece.parse_content(u"黄金真是一个奇妙的东西！谁拥有了它，谁就成为他想要的一切东西的主人，有了黄金，甚至可以使灵魂升入天堂。-------哥伦布"),{
            "content":u"黄金真是一个奇妙的东西！谁拥有了它，谁就成为他想要的一切东西的主人，有了黄金，甚至可以使灵魂升入天堂。",
            "author":u"哥伦布",
            "work":None
        })
        # 人名
        self.assertEqual(piece.parse_content(u"当下最流行三大病症：拖延症、强迫症、选择困难症，直白点说就是懒、贱、穷。----@王黎wario"),{
            "content":u"当下最流行三大病症：拖延症、强迫症、选择困难症，直白点说就是懒、贱、穷。",
            "author":u"@王黎wario",
            "work":None
        })
        # 书名
        self.assertEqual(piece.parse_content(u"我一直坚持的一个信念是，改变不了大环境，就改变小环境，做自己力所能及的事情。你不能决定太阳几点升起，但可以决定自己几点起床。——《自由在高处》"),{
            "content":u"我一直坚持的一个信念是，改变不了大环境，就改变小环境，做自己力所能及的事情。你不能决定太阳几点升起，但可以决定自己几点起床。",
            "author":None,
            "work":u"自由在高处"
        })
        # 人名及书名
        self.assertEqual(piece.parse_content(u"有时候，你很想念一个人，但你不会打电话给他。打电话给他，不知道说甚么好，还是不打比较好。想念一个人，不一定要听到他的声音。听到了他的声音也许就是另一回事。 想像中的一切往往比现实稍微美好一点。想念中的那个人也比现实稍微温暖一点。—— 约翰·肖尔斯《许愿树》"),{
            "content":u"有时候，你很想念一个人，但你不会打电话给他。打电话给他，不知道说甚么好，还是不打比较好。想念一个人，不一定要听到他的声音。听到了他的声音也许就是另一回事。 想像中的一切往往比现实稍微美好一点。想念中的那个人也比现实稍微温暖一点。",
            "author":u"约翰·肖尔斯",
            "work":u"许愿树"
        })
        self.assertEqual(piece.parse_content(u"永远不要忘记，直至上帝向人揭示出未来之日，人类全部智慧就包含在两个词中：等待和希望。 —《基督山伯爵》"),{
            "content":u"永远不要忘记，直至上帝向人揭示出未来之日，人类全部智慧就包含在两个词中：等待和希望。",
            "author": None,
            "work": u"基督山伯爵"
        })
        # 英文人名书名
        self.assertEqual(piece.parse_content(u"To choose doubt as a philosophy of life is akin to choosing immobility as a means of transportation. —— Yann Martel 《Life of Pi》"),{
            "content":u"To choose doubt as a philosophy of life is akin to choosing immobility as a means of transportation.",
            "author":u"Yann Martel",
            "work":u"Life of Pi"
        })
        # 英文人名
        self.assertEqual(piece.parse_content(u"qweqweq qwe q we qw eqw ew —— qweqwe"),{
            "content":u"qweqweq qwe q we qw eqw ew",
            "author":u"qweqwe",
            "work":None
        })
        # 过长中文认为非人名
        self.assertEqual(piece.parse_content(u"曰：我和我的小伙伴们都惊呆了？\n\n　　\n\n　　问：为什么惊呆了？\n\n　　--这个该怎么回答"),{
            "content":u"曰：我和我的小伙伴们都惊呆了？\n\n　　\n\n　　问：为什么惊呆了？\n\n　　--这个该怎么回答",
            "author":None,
            "work":None
        })