/**
 * Blog.
 *
 * Posts are plain data rather than MDX so the project has no content-pipeline
 * dependency and a non-developer can add an article by copying an entry. The body is a
 * list of typed blocks; `src/components/blog/post-body.tsx` renders each block kind.
 *
 * Editorial rule for this site: every post must be useful to someone in Maheshtala or
 * Budge Budge who trains at A Builder Hut. No generic listicles, no medical claims, and
 * no promised outcomes.
 */

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'note'; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Training' | 'Nutrition' | 'Recovery' | 'Gym life';
  readingMinutes: number;
  publishedOn: string;
  updatedOn?: string;
  author: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: 'training-at-night-shift-hours',
    title: 'How to train well when your shift ends at 11pm',
    excerpt:
      'Batanagar and Budge Budge run on shift work. Here is how to build a real training week around a late finish instead of abandoning it.',
    category: 'Training',
    readingMinutes: 6,
    publishedOn: '2026-06-18',
    author: 'A Builder Hut',
    body: [
      { kind: 'p', text: 'A 24-hour gym only helps if you know what to do with the hours. Most people who train after a late shift make the same three mistakes: they treat the session like a morning session, they eat as though it is dinner time, and they go to bed straight afterwards wondering why sleep will not come.' },
      { kind: 'h2', text: 'Move the hard work earlier in the week' },
      { kind: 'p', text: 'Strength is more sensitive to fatigue than conditioning is. If your rest days fall mid-week, put your heaviest squat and pull sessions on the days that follow them, and leave the late-week slots for machine work, accessories and cardio where a missed rep costs nothing.' },
      { kind: 'h2', text: 'Give yourself a wind-down window' },
      { kind: 'p', text: 'Training raises core temperature and adrenaline. Both need roughly an hour to come back down before sleep arrives easily. Finish with five minutes of easy cycling and some stretching rather than a maximal set, and keep the drive home dark and quiet.' },
      { kind: 'ul', items: [
        'Aim to finish your last working set at least 60 minutes before bed.',
        'Skip caffeine after your session — a pre-workout at 11pm is why you are staring at the ceiling at 2am.',
        'Eat a real meal, not just a shake. Protein plus rice or roti settles better than protein alone.',
      ] },
      { kind: 'h2', text: 'Protect the sleep, not the streak' },
      { kind: 'p', text: 'Four honest sessions a week with seven hours of sleep beats six sessions on five hours, every time. If the shift ran long and you are running on fumes, the correct training decision is to go home. The floor is open tomorrow at the same hour.' },
      { kind: 'note', text: 'General guidance for healthy adults. If you have a sleep disorder, a heart condition or you are on medication that affects heart rate, talk to your doctor about training times first.' },
    ],
  },
  {
    slug: 'bengali-kitchen-protein',
    title: 'Hitting your protein target from a Bengali kitchen',
    excerpt:
      'You do not need imported powders or chicken breast at every meal. Here is what a normal home kitchen already gives you, and where the gaps usually are.',
    category: 'Nutrition',
    readingMinutes: 7,
    publishedOn: '2026-05-02',
    updatedOn: '2026-07-11',
    author: 'A Builder Hut',
    body: [
      { kind: 'p', text: 'The most common reason a diet plan fails here is that it was written for a kitchen nobody in the house cooks in. A plan built around food already being made every day survives contact with real life. One built around six chicken-and-broccoli meals does not.' },
      { kind: 'h2', text: 'What you already have' },
      { kind: 'ul', items: [
        'Fish — rui, katla, bhetki, pabda. A palm-sized piece is a substantial protein serving.',
        'Eggs — the cheapest reliable protein available, and they keep.',
        'Dal — useful, though less protein-dense per serving than most people assume.',
        'Paneer and curd — good for vegetarians, and curd doubles as a post-training carbohydrate source.',
        'Chicken — for most people the easiest way to add a large serving without much cost.',
      ] },
      { kind: 'h2', text: 'Where the gap usually is' },
      { kind: 'p', text: 'Breakfast. A typical morning of muri, tea and a little dal contributes very little protein, which means the whole day is chasing a target it can no longer reach. Two eggs at breakfast fixes more than any supplement will.' },
      { kind: 'h2', text: 'A workable target' },
      { kind: 'p', text: 'Around 1.6 grams of protein per kilogram of bodyweight per day is enough for nearly everyone training for muscle or holding onto muscle while losing fat. For a 70 kg member that is roughly 112 grams — reachable with eggs at breakfast, fish or chicken at lunch and dinner, and curd somewhere in between.' },
      { kind: 'quote', text: 'The plan you follow for nine months beats the perfect plan you follow for three weeks.' },
      { kind: 'note', text: 'General guidance for healthy adults. Kidney disease, pregnancy and several medications change protein requirements — check with your doctor before making a large change.' },
    ],
  },
  {
    slug: 'first-month-beginner-guide',
    title: 'Your first month: what actually matters',
    excerpt:
      'Six movements, four sessions a week, and nothing heavier than you can control. What a well-spent first month at A Builder Hut looks like.',
    category: 'Training',
    readingMinutes: 5,
    publishedOn: '2026-04-09',
    author: 'A Builder Hut',
    body: [
      { kind: 'p', text: 'Almost everyone who quits the gym quits in the first six weeks, and almost always for one of two reasons: they got hurt, or they got bored because nothing seemed to be happening. Both are avoidable, and both are avoided in the same way.' },
      { kind: 'h2', text: 'Learn six movements' },
      { kind: 'ol', items: [
        'Squat — knees and hips bending together, chest up.',
        'Hinge — hips travelling back, spine neutral. This is the deadlift family.',
        'Push — overhead and horizontal pressing.',
        'Pull — rows and, eventually, chin-ups.',
        'Carry — pick something heavy up and walk with it.',
        'Brace — holding your midsection rigid under load. It underpins the other five.',
      ] },
      { kind: 'p', text: 'Everything else on the floor is a variation of these. Learn them with an empty bar or light dumbbells until the pattern holds when you are tired, and load comes quickly afterwards.' },
      { kind: 'h2', text: 'Turn up four times a week' },
      { kind: 'p', text: 'Four sessions is the point where progress becomes obvious without recovery becoming a problem. Three works. Six, in month one, mostly produces soreness and a missed week.' },
      { kind: 'h2', text: 'Measure at the start' },
      { kind: 'p', text: 'Bodyweight, a few tape measurements and your working weights on the main lifts, recorded on day one. In week eight the mirror will lie to you and the numbers will not.' },
    ],
  },
  {
    slug: 'training-through-kolkata-summer',
    title: 'Training through a Kolkata summer without losing the plot',
    excerpt:
      'Above 35°C with high humidity, your session needs adjusting — not abandoning. Hydration, timing and what to cut first.',
    category: 'Recovery',
    readingMinutes: 5,
    publishedOn: '2026-03-21',
    author: 'A Builder Hut',
    body: [
      { kind: 'p', text: 'Kolkata sits above 30°C daily mean for most of the year and pairs it with humidity that stops sweat evaporating. Air-conditioned floors solve most of it, but the walk in, the ride home and the rest of your day still count.' },
      { kind: 'h2', text: 'Drink to a schedule, not to thirst' },
      { kind: 'p', text: 'Thirst lags behind actual fluid loss, especially in humid heat. Half a litre in the hour before training and roughly 500ml per hour during it is a sensible baseline. If your session is long or you sweat heavily, add a pinch of salt or an electrolyte sachet — plain water alone can leave you flat.' },
      { kind: 'h2', text: 'What to cut first' },
      { kind: 'ul', items: [
        'Cut conditioning volume before you cut strength work — heat hits your ability to recover between intervals hardest.',
        'Extend rest periods by 30 seconds rather than dropping the weight.',
        'Move outdoor running to the cardio deck. Nothing is gained by running the Trunk Road at 2pm in June.',
      ] },
      { kind: 'note', text: 'Dizziness, stopping sweating, confusion or nausea in the heat are signs to stop training immediately and seek medical help. They are not something to push through.' },
    ],
  },
  {
    slug: 'why-24-hour-gyms-change-adherence',
    title: 'Why a 24-hour floor changes who actually sticks with it',
    excerpt:
      'The strongest predictor of results is not the programme. It is how many planned sessions you complete — and opening hours quietly decide that.',
    category: 'Gym life',
    readingMinutes: 4,
    publishedOn: '2026-02-14',
    author: 'A Builder Hut',
    body: [
      { kind: 'p', text: 'Two members follow the same programme for six months. One completes 80% of planned sessions, the other 45%. The first will be visibly stronger and leaner. Nothing in the programme explains the difference — the calendar does.' },
      { kind: 'h2', text: 'Adherence is mostly logistics' },
      { kind: 'p', text: 'People rarely stop training because they lost motivation in the abstract. They stop because a shift ran late, a gym closed at 10pm, and one missed session became a missed week. Remove the closing time and a whole category of missed sessions disappears.' },
      { kind: 'quote', text: 'The best programme is the one your week can actually accommodate.' },
      { kind: 'h2', text: 'Use the flexibility deliberately' },
      { kind: 'p', text: 'A 24-hour floor is not an invitation to train at random. Pick two anchor slots that almost never move, and let the other two float to wherever the week allows. That gives you a routine with a release valve, which survives a bad month better than a rigid schedule does.' },
    ],
  },
];

export const blogCategories = ['All', 'Training', 'Nutrition', 'Recovery', 'Gym life'] as const;

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export const sortedPosts = [...posts].sort(
  (a, b) => new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime(),
);
