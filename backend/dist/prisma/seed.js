"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const sampleContent = [
    {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        videoUrl: 'https://example.com/inception.mp4',
        year: 2010,
        genre: 'Sci-Fi',
        rating: 8.8,
        duration: 148,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    },
    {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        videoUrl: 'https://example.com/dark-knight.mp4',
        year: 2008,
        genre: 'Action',
        rating: 9.0,
        duration: 152,
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    },
    {
        title: 'Interstellar',
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        videoUrl: 'https://example.com/interstellar.mp4',
        year: 2014,
        genre: 'Sci-Fi',
        rating: 8.6,
        duration: 169,
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    },
    {
        title: 'The Matrix',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        videoUrl: 'https://example.com/matrix.mp4',
        year: 1999,
        genre: 'Sci-Fi',
        rating: 8.7,
        duration: 136,
        cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    },
    {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        videoUrl: 'https://example.com/pulp-fiction.mp4',
        year: 1994,
        genre: 'Crime',
        rating: 8.9,
        duration: 154,
        cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    },
    {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        videoUrl: 'https://example.com/forrest-gump.mp4',
        year: 1994,
        genre: 'Drama',
        rating: 8.8,
        duration: 142,
        cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    },
    {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        videoUrl: 'https://example.com/shawshank.mp4',
        year: 1994,
        genre: 'Drama',
        rating: 9.3,
        duration: 142,
        cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    },
    {
        title: 'Fight Club',
        description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        videoUrl: 'https://example.com/fight-club.mp4',
        year: 1999,
        genre: 'Drama',
        rating: 8.8,
        duration: 139,
        cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
    },
    {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        videoUrl: 'https://example.com/godfather.mp4',
        year: 1972,
        genre: 'Crime',
        rating: 9.2,
        duration: 175,
        cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
        videoUrl: 'https://example.com/lotr-return.mp4',
        year: 2003,
        genre: 'Fantasy',
        rating: 8.9,
        duration: 201,
        cast: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen'],
    },
    {
        title: 'Gladiator',
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
        videoUrl: 'https://example.com/gladiator.mp4',
        year: 2000,
        genre: 'Action',
        rating: 8.5,
        duration: 155,
        cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
    },
    {
        title: 'The Prestige',
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg',
        videoUrl: 'https://example.com/prestige.mp4',
        year: 2006,
        genre: 'Mystery',
        rating: 8.5,
        duration: 130,
        cast: ['Christian Bale', 'Hugh Jackman', 'Scarlett Johansson'],
    },
    {
        title: 'Goodfellas',
        description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
        videoUrl: 'https://example.com/goodfellas.mp4',
        year: 1990,
        genre: 'Crime',
        rating: 8.7,
        duration: 145,
        cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
    },
    {
        title: 'The Silence of the Lambs',
        description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
        videoUrl: 'https://example.com/silence-lambs.mp4',
        year: 1991,
        genre: 'Thriller',
        rating: 8.6,
        duration: 118,
        cast: ['Jodie Foster', 'Anthony Hopkins', 'Scott Glenn'],
    },
    {
        title: 'Saving Private Ryan',
        description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
        videoUrl: 'https://example.com/saving-private-ryan.mp4',
        year: 1998,
        genre: 'War',
        rating: 8.6,
        duration: 169,
        cast: ['Tom Hanks', 'Matt Damon', 'Tom Sizemore'],
    },
];
async function main() {
    console.log('🌱 Seeding database...');
    await prisma.streamingContent.deleteMany();
    for (const content of sampleContent) {
        await prisma.streamingContent.create({
            data: content,
        });
    }
    console.log(`✅ Created ${sampleContent.length} streaming content items`);
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map