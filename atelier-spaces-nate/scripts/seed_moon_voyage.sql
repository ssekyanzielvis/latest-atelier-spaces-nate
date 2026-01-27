-- Seed default Moon Voyage content from PDF
INSERT INTO moon_voyage (
  title,
  subtitle,
  vision_title,
  vision_content,
  challenge_title,
  challenge_content,
  challenge_date,
  challenge_location,
  funding_goal,
  funding_description,
  board_price,
  support_price,
  payment_momo,
  payment_bank,
  payment_message,
  is_active
) VALUES (
  'THE Omweso MOON VOYAGE',
  '"The first Mweso game ever recorded atop the moon ranges of the Rwenzori."',
  'Our Vision: From our land to the Universe.',
  'For centuries, the clicks of the Omweso seeds were the heartbeat of the logic of our ancestors. It was a sanctuary of strategy, a council of kinsmen, and the ultimate test of the African mind. But as the world moved faster, our most beautiful game was left in the shadows of trees—undervalued, under-recorded, and overlooked.

Atelier Spaces Nate is here to change that narrative forever. We are reclaiming the game''s legacy.

Our mission is audacious: to make Omweso one of the most recognizable intellectual sports on the planet. We are stripping away the "pastime" label and replacing it with the Kinsman Challenge—a series of mind-blowing creative spectacles that will place the Omweso board in the world''s most extreme, iconic, and beautiful scenarios.

From the jagged peaks of the Rwenzori to the neon-lit squares of Tokyo, and eventually—as our technology and ambition evolve—beyond the globe itself, we will prove that Ugandan logic knows no bounds.',
  'Challenge 01: The Moon Voyage (Margherita Peak)',
  'In June 2026, during the height of the dry season, Mugabi Arafatih and the Atelier Spaces Nate team will undertake the First Kinsman Challenge.

We are heading to the roof of Africa—Margherita Peak (5,109 m). There, amidst the glaciers and the thin air of the Rwenzori, we will record the first-ever Omweso match at the highest point in Uganda. This is a world-first. A record-setter. A cinematic tribute to the grit of the Ugandan spirit.

This is the first ring of the 32. A multitude of challenges will follow, each more daring than the last, until the world knows the name of our game.',
  'June 2026',
  'Margherita Peak (5,109 m), Rwenzori Mountains',
  '40,000,000 UGX',
  'We are calling upon the lovers of culture, the pioneers of film, the patriots of Uganda, and the believers in the African story to this community-funded quest.

To execute this first historic challenge—covering the engineering of the Moon Voyage Board, the production of the Kinsman Garments, and the complex logistics of a high-altitude film crew—we are collecting a total of 40,000,000 UGX.

By backing this voyage, you are ensuring that when the first seed is sown on the Margherita glacier, your name is part of the wind that carried it there. Help us take our logic to the summit.',
  '200,000 SHS - Limited Edition Moon Voyage Board',
  '1,000,000 SHS - In Kind Support',
  'MTN MoMo: 0770697466 (Ssakka Abudusalam)',
  'Bank: UBA | Acc: 1057011889 (Mugabi Arafatih)',
  'Your contribution is the fuel for this cultural engine. Whether you are buying a board to keep the game alive in your home, or contributing to the voyage logistics to see our flag fly at the summit, you are making history.

We believe in the power of the collective. Every shilling of the 40M UGX goal goes directly into the engineering, filming, and safety of this record-breaking feat. Thank you for believing that Ugandan stories deserve to be told.

Please share your confirmation so we can add you to the Kinsman Registry.',
  true
)
ON CONFLICT DO NOTHING;
