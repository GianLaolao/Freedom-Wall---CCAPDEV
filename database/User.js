const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: Number,
    username: String,
    profile: {
      type: String,
      default: "pfp.jpg"
    },
    bio: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    birthday: Date,
    dateCreated: {
        type: Date,
        default: () => Date.now(),
    },
})

const User = mongoose.model('User', UserSchema)

async function refresh() {
  try {
      await User.deleteMany({});
      console.log("Refreshed schema.");

      await User.insertMany([
        { _id: 1001,  username: 'Mr. Green', bio: 'I love Programming and making Websites. <br>I also love the color Green.', 
          email: 'iam_green123@gmail.com', password: '1HateYellow',  birthday: new Date(1900, 9, 10), dateCreated: new Date(2024, 1, 20)},
        { _id: 1002,  username: 'not Walter White', bio: 'I am not Walter Hartwell White. <br>I do not live At 308 Negra Aroya Lane, Albuquerque, New Mexico, 87104', 
          email: 'ih8_chem1stry@gmail.com', password: '1amth30newh0knock5',  birthday: new Date(1958, 8, 7), dateCreated: new Date(2024, 0, 20)},
        { _id: 1003,  username: 'Elon Musk', bio: 'Genius Billionaire Philanthrophist but no armor', 
          email: 'ilikedoge@gmail.com', password: 'iloveXAEAXiii',  birthday: new Date(1971, 5, 28), dateCreated: new Date(2024, 0, 25)},
        { _id: 1004,  username: 'Jack-99', bio: 'I am Jack-99, formerly Jack-98', 
          email: 'gigaton_spammer@gmail.com', password: 'hcf15circles',  birthday: new Date(1991, 8, 21), dateCreated: new Date(2024, 1, 12)},
        { _id: 1005,  username: 'Himmel-sama', bio: 'To live is to be known and remembered by others.', 
          email: 'himmelthehero123@gmail.com', password: 'sugetsuso3ren',  birthday: new Date(1947, 3, 28), dateCreated: new Date(2024, 1, 1)}, 
        { _id: 1006,  username: 'not Jesse Pinkman', bio: 'You either run from things, or you face them.', 
          email: 'jesse_pinkman2@gmail.com', password: 'yeahsc1enc3',  birthday: new Date(1984, 8, 24), dateCreated: new Date(2024, 1, 23)},
        { _id: 1007,  username: 'Lukewarm Walker', bio: 'I\'m Lukewarm Walker, I\'m here to rehydrate you.', 
          email: 'maythefaucetbewithyou@gmail.com', password: 'Youar3n0tmywateR',  birthday: new Date(1951, 8, 25), dateCreated:new Date(2024, 0, 29)}, 
        { _id: 1008,  username: 'Hyou Ka', bio: 'Everything... makes me curious', 
          email: 'iscream_01@gmail.com', password: 'kininarimasu11',  birthday: new Date(2000, 3, 22), dateCreated: new Date(2024, 0, 19)},
        { _id: 1009, username: 'Mr. Best', bio: 'Please buy Eatables Chocolate', 
          email: 'mistah_best9000@gmail.com', password:'letsBeatUSeries2', birthday: new Date(1998, 4, 7), dateCreated: new Date(2024, 2, 1)},
        { _id: 1010, username: 'Mark Zarksburger', bio: 'Founder and CEO of Foodbook', 
          email: 'markzarks_19@gmail.com', password:'BetaversE22', birthday: new Date(1984, 4, 14), dateCreated: new Date(2024, 1, 10)},
        { _id: 1011, username: 'Carlos Magsen', bio: 'Magsen 1 - Starkfish 0, Bongcloud Connoisseur', 
          email: 'bongclaudius_kingsen9@gmail.com', password:'e4Ke2Ke1Ke2Ke1', birthday: new Date(1990, 10, 30), dateCreated: new Date(2024, 2, 18)}
    ]);
      console.log("Data inserted successfully.");
  } catch (error) {
      console.error("Error:", error);
  }
};

// refresh();

module.exports = User