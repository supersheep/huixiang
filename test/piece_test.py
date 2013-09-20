#encoding=utf-8
import unittest
from model import piece

class PieceCase(unittest.TestCase):
    def setUp(self):
        pass
    def tearDown(self):
        pass

    def testParseContent(self):
        """ testParseContent """
        self.assertEqual(piece.parse_content(u"我们终将浑然一体，就像水溶于水。 \n——柴静"),{
            "content":u"我们终将浑然一体，就像水溶于水。",
            "author":u'柴静',
            "art":None
        })
        self.assertEqual(piece.parse_content(u"黄金真是一个奇妙的东西！谁拥有了它，谁就成为他想要的一切东西的主人，有了黄金，甚至可以使灵魂升入天堂。-------哥伦布"),{
            "content":u"黄金真是一个奇妙的东西！谁拥有了它，谁就成为他想要的一切东西的主人，有了黄金，甚至可以使灵魂升入天堂。",
            "author":u"哥伦布",
            "art":None
        })
        self.assertEqual(piece.parse_content(u"当下最流行三大病症：拖延症、强迫症、选择困难症，直白点说就是懒、贱、穷。----@王黎wario"),{
            "content":u"当下最流行三大病症：拖延症、强迫症、选择困难症，直白点说就是懒、贱、穷。",
            "author":u"@王黎wario",
            "art":None
        })
        self.assertEqual(piece.parse_content(u"有时候，你很想念一个人，但你不会打电话给他。打电话给他，不知道说甚么好，还是不打比较好。想念一个人，不一定要听到他的声音。听到了他的声音也许就是另一回事。 想像中的一切往往比现实稍微美好一点。想念中的那个人也比现实稍微温暖一点。—— 约翰·肖尔斯《许愿树》"),{
            "content":u"有时候，你很想念一个人，但你不会打电话给他。打电话给他，不知道说甚么好，还是不打比较好。想念一个人，不一定要听到他的声音。听到了他的声音也许就是另一回事。 想像中的一切往往比现实稍微美好一点。想念中的那个人也比现实稍微温暖一点。",
            "author":u"约翰·肖尔斯",
            "art":u"许愿树"
        })
        self.assertEqual(piece.parse_content(u"To choose doubt as a philosophy of life is akin to choosing immobility as a means of transportation. —— Yann Martel 《Life of Pi》"),{ 
            "content":u"To choose doubt as a philosophy of life is akin to choosing immobility as a means of transportation.",
            "author":u"Yann Martel",
            "art":u"Life of Pi"
        })

        self.assertEqual(piece.parse_content(u"曰：我和我的小伙伴们都惊呆了？\n\n　　\n\n　　问：为什么惊呆了？\n\n　　--这个该怎么回答"),None)
        self.assertEqual(piece.parse_content("https://stacksocial.com/sales/the-mac-freebie-bundle-2-0"),None)