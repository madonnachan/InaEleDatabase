// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB_7wrdUBC58x0MnZEZC2ByotZbErUewn8",
    authDomain: "inaeledatabase.firebaseapp.com",
    projectId: "inaeledatabase",
    storageBucket: "inaeledatabase.appspot.com",
    messagingSenderId: "538910280609",
    appId: "1:538910280609:web:de304e3dc87b36d95759e0",
    measurementId: "G-LFWC91K1MQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById('character-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];

    const storageRef = ref(storage, `images/${image.name}`);

    try {
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'characters'), {
            name: name,
            description: description,
            imageUrl: url,
        });

        document.getElementById('success-message').style.display = 'block';
        document.getElementById('character-form').reset();
        loadCharacters(); // キャラクターリストの再読み込み
    } catch (error) {
        console.error('Error adding document: ', error);
    }
});

async function loadCharacters() {
    const characterList = document.getElementById('character-list');
    characterList.innerHTML = ''; // 既存のキャラクターリストをクリア

    const querySnapshot = await getDocs(collection(db, 'characters'));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const col = document.createElement('div');
        col.className = 'col-md-4';
        const card = document.createElement('div');
        card.className = 'character-card';
        const cardImg = document.createElement('img');
        cardImg.src = data.imageUrl;
        const cardBody = document.createElement('div');
        const cardTitle = document.createElement('h5');
        cardTitle.textContent = data.name;
        const cardText = document.createElement('p');
        cardText.textContent = data.description;
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(cardImg);
        card.appendChild(cardBody);
        col.appendChild(card);
        characterList.appendChild(col);
    });
}

// 初回ロード時にキャラクターリストを表示
loadCharacters();