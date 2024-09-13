-- Вставка данных в mood_contents
INSERT INTO mood_contents (type) 
SELECT 'happy' WHERE NOT EXISTS (SELECT 1 FROM mood_contents WHERE type = 'happy');
INSERT INTO mood_contents (type) 
SELECT 'sad' WHERE NOT EXISTS (SELECT 1 FROM mood_contents WHERE type = 'sad');
INSERT INTO mood_contents (type) 
SELECT 'neutral' WHERE NOT EXISTS (SELECT 1 FROM mood_contents WHERE type = 'neutral');
INSERT INTO mood_contents (type) 
SELECT 'angry' WHERE NOT EXISTS (SELECT 1 FROM mood_contents WHERE type = 'angry');
INSERT INTO mood_contents (type) 
SELECT 'anxious' WHERE NOT EXISTS (SELECT 1 FROM mood_contents WHERE type = 'anxious');

-- Вставка данных в emotions
INSERT INTO emotions (name) 
SELECT 'joy' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'joy');
INSERT INTO emotions (name) 
SELECT 'sadness' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'sadness');
INSERT INTO emotions (name) 
SELECT 'anger' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'anger');
INSERT INTO emotions (name) 
SELECT 'fear' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'fear');
INSERT INTO emotions (name) 
SELECT 'surprise' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'surprise');
INSERT INTO emotions (name) 
SELECT 'disgust' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'disgust');
INSERT INTO emotions (name) 
SELECT 'interest' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'interest');
INSERT INTO emotions (name) 
SELECT 'calmness' WHERE NOT EXISTS (SELECT 1 FROM emotions WHERE name = 'calmness');

-- Вставка данных в context_factors
INSERT INTO context_factors (name) 
SELECT 'job' WHERE NOT EXISTS (SELECT 1 FROM context_factors WHERE name = 'job');
INSERT INTO context_factors (name) 
SELECT 'relationships' WHERE NOT EXISTS (SELECT 1 FROM context_factors WHERE name = 'relationships');
INSERT INTO context_factors (name) 
SELECT 'weather' WHERE NOT EXISTS (SELECT 1 FROM context_factors WHERE name = 'weather');
INSERT INTO context_factors (name) 
SELECT 'health' WHERE NOT EXISTS (SELECT 1 FROM context_factors WHERE name = 'health');
INSERT INTO context_factors (name) 
SELECT 'finance' WHERE NOT EXISTS (SELECT 1 FROM context_factors WHERE name = 'finance');
INSERT INTO context_factors (name) 
SELECT 'hobby' WHERE NOT EXISTS (SELECT 1 FROM context_factors WHERE name = 'hobby');
INSERT INTO context_factors (name) 
SELECT 'family' WHERE NOT EXISTS (SELECT 1 FROM context_factors WHERE name = 'family');

-- Вставка данных в effects
INSERT INTO effects (name) 
SELECT 'positive' WHERE NOT EXISTS (SELECT 1 FROM effects WHERE name = 'positive');
INSERT INTO effects (name) 
SELECT 'negative' WHERE NOT EXISTS (SELECT 1 FROM effects WHERE name = 'negative');
INSERT INTO effects (name) 
SELECT 'neutral' WHERE NOT EXISTS (SELECT 1 FROM effects WHERE name = 'neutral');
