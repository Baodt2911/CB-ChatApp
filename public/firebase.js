import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, onAuthStateChanged, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, collection, serverTimestamp, addDoc, getDocs, updateDoc, doc, onSnapshot, orderBy, query, where, arrayUnion, arrayRemove, limitToLast } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"
const firebaseConfig = {
    apiKey: "AIzaSyCLQMrKMIBQ1SSaVXnYOIA7xRWnaujqs3k",
    authDomain: "chat-app-db76c.firebaseapp.com",
    projectId: "chat-app-db76c",
    storageBucket: "chat-app-db76c.appspot.com",
    messagingSenderId: "229921808609",
    appId: "1:229921808609:web:810c43199698879db457a0",
    measurementId: "G-XLGK7BY9GY"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth();
const storage = getStorage();
// connectAuthEmulator(auth, "http://localhost:9099")
// if (window.location.hostname === "localhost") {
//     connectAuthEmulator(db, "localhost", 8080)
// }
const FacebookButton = document.querySelector(".btn-login-facebook")
const GoogleButton = document.querySelector(".btn-login-google")
const LogOutButton = document.querySelector(".btn-logout")
const FacebookProvider = new FacebookAuthProvider();
const GoogleProvider = new GoogleAuthProvider()
const avatarUser = document.querySelector(".avatar")
const nameUser = document.querySelector(".name")
const cardLogin = document.querySelector(".login")
const btnCreateGroup = document.querySelector(".btn-create-group")
const btnJoinGroup = document.querySelector(".btn-join-group")
const btnInvite = document.querySelector(".btn-invite")
const closeCreateGroup = document.querySelector(".close-create-group")
const closeJoinGroup = document.querySelector(".close-join-group")
const closeInvite = document.querySelector('.close-invite')
const cardCreateGroup = document.querySelector(".create-group")
const cardJoinGroup = document.querySelector(".join-group")
const cardInvite = document.querySelector(".invite")
const showImages = document.querySelector(".show-images-group img")
const imagesUpload = document.getElementById("file-upload")
const nameGroupCreate = document.querySelector(".name-group-input")
const codeGroup = document.querySelector('.code-group')
const coppyCode = document.querySelector('.coppy-code')
const createGroup = document.querySelector(".btn-create-group-official")
const groupChat = document.querySelector(".group-chat")
const ChatRoom = document.querySelector(".chat-room")
const notRoom = document.querySelector(".not-room")
const btnOption = document.querySelector('.btn-option')
const cardShowMembers = document.querySelector('.show-members')
const joinRoom = document.querySelector('.btn-join-room')
const codeGroupJoin = document.querySelector('.code-group-input')
const sendMessage = document.querySelector('.message-send')
const btnSendMessage = document.querySelector('.btn-send-message')
const cardChat = document.querySelector('.chat')
const mainChat = document.querySelector('.main-chat')
const notice = document.querySelector(".notice")
const backToListRoom = document.querySelector('.back-to-list-room')
const handleNotice = (text) => {
    notice.classList.remove('invisible')
    notice.classList.remove('opacity-0')
    notice.classList.remove('-translate-y-56')
    notice.innerHTML = text
    setTimeout(() => {
        notice.classList.add('invisible')
        notice.classList.add('opacity-0')
        notice.classList.add('-translate-y-56')
    }, 3000)
    notice.addEventListener('click', () => {
        notice.classList.add('invisible')
        notice.classList.add('opacity-0')
        notice.classList.add('-translate-y-56')
    })
}
document.addEventListener("click", e => {
    if (btnOption.contains(e.target) || cardShowMembers.contains(e.target)) {
        cardShowMembers.classList.remove("invisible")
        cardShowMembers.classList.remove("opacity-0")
    } else {
        cardShowMembers.classList.add("invisible")
        cardShowMembers.classList.add("opacity-0")
    }
})

coppyCode.addEventListener("click", () => {
    coppyCode.innerText = "Đã sao chép"
    const isSupported = (cmd) => {
        return document.queryCommandSupported(cmd);
    };//Check support copy
    const range = document.createRange(),
        selection = window.getSelection();
    selection.removeAllRanges();
    range.selectNodeContents(codeGroup);
    selection.addRange(range);
    try {
        if (isSupported("copy")) document.execCommand("copy");
        else handleNotice('execCommand("copy") is not supported in your browser.');
    } catch (e) {
        console.log(e);
    }
    selection.removeAllRanges();
})
const handleAddFirestore = async (providerId, user) => {
    let isAddDocs = true
    const uid = user.uid
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => { //Kiểm tra xem user đã đăng nhập trước đó chưa
        if (uid == doc.data().uid) {
            isAddDocs = false
        }
    });// Có thể dùng some const isAddDocs = querySnapShot.some(doc => doc.data().uid == uid)
    if (isAddDocs) {
        addDoc(collection(db, "users"), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            providerId: providerId,
            uid: uid,
        });
    }
}
FacebookButton.addEventListener("click", async () => {
    const { providerId, user } = await signInWithPopup(auth, FacebookProvider)
    handleAddFirestore(providerId, user)

})
GoogleButton.addEventListener("click", async () => {
    const { providerId, user } = await signInWithPopup(auth, GoogleProvider)
    handleAddFirestore(providerId, user)
})
LogOutButton.addEventListener("click", () => {
    auth.signOut();
    window.location.reload();
})
const handleOnCard = (element) => {
    element.classList.remove("invisible")
    element.classList.remove("opacity-0")

}
const handleOffCard = (element) => {
    element.classList.add("invisible")
    element.classList.add("opacity-0")
    codeGroupJoin.value = ""
    showImages.src = ""
    nameGroupCreate.value = ""
    imagesUpload.value = ""
    coppyCode.innerText = "Sao chép"
}
btnCreateGroup.addEventListener("click", () => handleOnCard(cardCreateGroup))
btnJoinGroup.addEventListener("click", () => handleOnCard(cardJoinGroup))
btnInvite.addEventListener('click', () => handleOnCard(cardInvite))
closeCreateGroup.addEventListener("click", () => handleOffCard(cardCreateGroup))
closeJoinGroup.addEventListener("click", () => handleOffCard(cardJoinGroup))
closeInvite.addEventListener("click", () => handleOffCard(cardInvite))
const types = ['image/png,image/jpg,image/jpeg']
imagesUpload.addEventListener("change", (e) => {
    URL.revokeObjectURL(showImages.src)//Xóa đi URL local trước đó
    const file = e.target.files[0]
    const isType = types.some(type => type.includes(file.type))
    if (isType) {
        const srcImg = URL.createObjectURL(file)
        showImages.src = srcImg
        return;
    }
    handleNotice('Sai định dạng ảnh')
})

const getCurrentUser = (callback) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            avatarUser.classList.remove('loading-avatar')
            avatarUser.classList.add('active-user')
            nameUser.innerText = user.displayName
            avatarUser.querySelector('img').src = user.photoURL
            cardLogin.style.display = "none"
            callback(user)
        } else {
            cardLogin.style.display = "flex"
            console.error('User not found');
        }
    })
}

getCurrentUser((currentUser) => {
    const formatDate = (seconds) => {
        let date = new Date(seconds * 1000)
        let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let data = `${date.getHours()}:${minutes}`
        return data;
    }
    const handleRenderRooms = (datas) => {
        const html = datas.map(data =>
            `
               <div class="item-group-chat" data-code=${data.roomCode}>
                    <div class="avatar-group-chat ">
                       <img src=${data.photoURL} alt="group-avatar" class="w-full h-full object-cover rounded-full border ">
                   </div>
                       <div class="flex-grow pr-3">
                           <p
                               class="w-32 sm:w-52 name-group text-lg lg:text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                               ${data.roomName}</p>
                               <div class="currentMessage flex items-center justify-between">

                               </div>
                           </div>
                       </div>
               `)
        groupChat.innerHTML = html.join("")
        const itemRoom = document.querySelectorAll(".item-group-chat")
        itemRoom.forEach(room => room.addEventListener("click", handleRenderChatMessage))
        if (document.querySelector('body').offsetWidth < 1024) {//Khi màn hình nhỏ hơn 640px
            itemRoom.forEach(room => room.addEventListener("click", () => {
                document.querySelector('.content').scrollLeft = document.querySelector('body').offsetWidth
                handleNotice(`<i class="fa-solid fa-chevron-left"></i>
                Vuốt sang bên để quay lại`)
            }))
            backToListRoom.addEventListener('click', () => {
                document.querySelector('.content').scrollLeft = - document.querySelector('body').offsetWidth
            })
        }
        datas.forEach(data => {
            const queryMessages = query(collection(db, "messages"), where("roomCode", "==", data.roomCode), orderBy("createdAt", "asc"), limitToLast(1))//Lấy tin nhắn cuối cùng
            onSnapshot(queryMessages, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    ...doc.data()
                }))
                if (data.length == 0) {
                    return
                }
                itemRoom.forEach(rooms => {
                    if (rooms.dataset.code == data[0].roomCode) {
                        rooms.querySelector('.currentMessage').innerHTML = `
                        <p class="w-32 sm:w-96 lg:w-40 text-xs font-sans font-normal text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                        <span class="lg:text-sm font-semibold">${data[0].displayName}</span> : ${data[0].text}</p>
                        <span class="text-[10px] sm:text-xs">${formatDate(data[0]?.createdAt?.seconds)}</span>
                        `
                    }
                })
            })
        })
    }
    const collectionRooms = query(collection(db, "rooms"), where("members", "array-contains", currentUser.uid), orderBy("createdAt", "desc")) //Lấy dữ liệu theo thời gian tạo room
    onSnapshot(collectionRooms, (querySnapshot) => {//Lắng nghe dữ liệu của users khi thay đổi và tự động trả về database
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }))
        if (data.length == 0) {
            return
        }
        handleRenderRooms(data)
    });
    const randomRoomCode = () => {
        let character = 'abcdefghijklmnopqrstuvwxyz'
        let result = ''
        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * character.length)
            const char = character.charAt(index)
            result += char.toUpperCase()
            character = character.replace(char, '')
        }
        return result;
    }

    const handleCreateRooms = () => {
        let roomCode = randomRoomCode()
        const isType = types.some(type => {
            if (imagesUpload.files[0]) {
                return type.includes(imagesUpload.files[0].type)
            }
        })
        if (isType && nameGroupCreate.value) {
            const storageRef = ref(storage, imagesUpload.files[0].name);
            uploadBytes(storageRef, imagesUpload.files[0]).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                handleNotice('Tạo nhóm thành công')
                addDoc(collection(db, "rooms"),
                    {
                        createdAt: serverTimestamp(),
                        roomCode: roomCode,
                        roomName: nameGroupCreate.value,
                        photoURL: `https://firebasestorage.googleapis.com/v0/b/chat-app-db76c.appspot.com/o/${imagesUpload.files[0].name}?alt=media`,
                        members: [currentUser.uid]
                    })
                handleOffCard(cardCreateGroup)
            });
        }
    }
    createGroup.addEventListener("click", handleCreateRooms)
    nameGroupCreate.addEventListener("keypress", e => {
        if (e.key == "Enter") {
            handleCreateRooms()
        }
    })
    const getDataWithRoomCode = (roomCode, callback) => {
        const collectionMembers = query(collection(db, "rooms"), where("roomCode", "==", roomCode))
        onSnapshot(collectionMembers, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            if (data.length == 0) {
                return
            }
            callback(data)
            roomCode = '' //Clear roomCode
        })
    }
    const handleRenderChatMessage = (e) => {
        const roomCode = e.currentTarget.dataset.code
        roomCode ? notRoom.style.display = "none" : notRoom.style.display = "flex"
        ChatRoom.style.display = 'flex'
        getDataWithRoomCode(roomCode, (data) => {//Render Memmber Rooms
            ChatRoom.querySelector('p').innerText = data[0].roomName
            ChatRoom.querySelector('.image-room').src = data[0].photoURL
            codeGroup.innerText = data[0].roomCode
            if (data[0].members.length == 0) {
                return
            }
            const collectionUsers = query(collection(db, 'users'), where("uid", "in", data[0]?.members), orderBy("displayName", "desc")) //Lấy ra user có trong phòng 'data.members phải làm một mảng vì dùng query in'
            onSnapshot(collectionUsers, (querySnapshot) => {//Lắng nghe dữ liệu của users khi thay đổi và tự động trả về 
                const datas = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                }))
                const html = datas.map(data =>
                    `<li class="w-[90%] flex items-center gap-2">
                        <img src=${data.photoURL}
                            alt="" class="w-12 h-12 rounded-full object-cover flex-shrink-0 flex-grow-0">
                        <p class="overflow-hidden whitespace-nowrap text-ellipsis">${data.displayName}</p>
                    </li>`
                )
                cardShowMembers.innerHTML = html.join('')
            });
        })
        const queryMessages = query(collection(db, "messages"), where("roomCode", "==", roomCode), orderBy("createdAt", "asc"))
        onSnapshot(queryMessages, (querySnapshot) => {
            const datas = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }))
            const html = datas.map(data =>
                `<div class="item-message " data-id=${data.uid}>
                <div class="avatar-user-message  w-7 h-7 lg:w-12 lg:h-12 rounded-full ">
                    <img src=${data.photoURL} alt="avatar" class="bdt-images ">
                </div>
                <div class="title-message  max-w-[70%] sm:max-w-[50%]">
                    <p class="name-message-user">${data.displayName}</p>
                    <div class="message-card w-full flex items-center gap-2 lg:gap-4">
                        <section class="message-text" >
                            ${data.text}
                        </section>
                        <span class="time-send font-normal text-[10px] lg:text-sm  font-sans opacity-75">${formatDate(data.createdAt?.seconds)}</span>
                    </div>
                </div>
            </div>`
            )
            cardChat.innerHTML = html.join('')
            cardChat.classList.remove('loading-message')
            mainChat.classList.remove('overflow-hidden')
            const uidMessageEqualuidUser = document.querySelectorAll(".item-message")
            uidMessageEqualuidUser.forEach(message => {
                if (message.dataset.id == currentUser.uid) {
                    message.style.justifyContent = "end"
                    message.querySelector(".avatar-user-message").style.order = "2"
                    message.querySelector(".name-message-user").style = 'text-align:right'
                    message.querySelector(".message-text").style = "color:#fff;background:#088395cc;order:2"
                }
            })
            mainChat.scrollTo({ top: mainChat.scrollHeight, behavior: 'smooth' });
        })
    }
    const handleJoinRoom = () => {
        const roomCode = codeGroupJoin.value.toUpperCase()
        getDataWithRoomCode(roomCode, async (data) => {
            const ref = doc(db, "rooms", data[0].id)
            try {
                await updateDoc(ref, {
                    members: arrayUnion(currentUser.uid)
                })
                handleOffCard(cardJoinGroup)
                handleNotice('Đã vào phòng')
            } catch (error) {
                console.log("Error: ", error);
                console.log("cccc");
            }
        })
    }
    joinRoom.addEventListener('click', handleJoinRoom)
    codeGroupJoin.addEventListener("keypress", e => {
        if (e.key == "Enter") {
            handleJoinRoom()
        }
    })
    const handleSendMessage = () => {
        const roomCode = codeGroup.innerHTML
        const messageText = sendMessage.value
        if (messageText) {
            addDoc(collection(db, "messages"), {
                createdAt: serverTimestamp(),
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                roomCode: roomCode,
                text: messageText,
                uid: currentUser.uid
            })
        }
        sendMessage.value = ''
        mainChat.scrollTo({ top: mainChat.scrollHeight, behavior: 'smooth' });
    }
    btnSendMessage.addEventListener('click', handleSendMessage)
    sendMessage.addEventListener("keypress", (e) => {
        if (e.key == 'Enter') {
            handleSendMessage()
        }
    })
});
