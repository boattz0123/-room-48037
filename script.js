// กำหนดค่า Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA5tVA_cb6VKcD2no0Num9WXqU2SfaX68o",
    authDomain: "room-48037.firebaseapp.com",
    databaseURL: "https://room-48037-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "room-48037",
    storageBucket: "room-48037.appspot.com",
    messagingSenderId: "630327498894",
    appId: "1:630327498894:web:04627ad6e2a531d87f51df",
};

// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// ฟังก์ชันสร้างบล็อกห้อง
function createRoomBlock(roomName) {
    var roomBlock = document.createElement('div');
    roomBlock.className = 'room-block';
    roomBlock.innerHTML = `
        <h2>${roomName}</h2>
        <p>Voltage: <span id="${roomName}-voltage" class="data-value" contenteditable="true">N/A</span> V</p>
        <p>Current: <span id="${roomName}-current" class="data-value" contenteditable="true">N/A</span> A</p>
        <p>Power: <span id="${roomName}-power" class="data-value" contenteditable="true">N/A</span> W</p>
    `;
    document.getElementById('rooms').appendChild(roomBlock);
    getRoomData(roomName); // ดึงข้อมูลของห้องนี้
    setupRoomDataUpdate(roomName);
}

// ฟังก์ชันดึงข้อมูลของห้อง
function getRoomData(roomName) {
    database.ref('rooms/' + roomName).on('value', function (snapshot) {
        const data = snapshot.val();
        document.getElementById(`${roomName}-voltage`).textContent = data.voltage + " V";
        document.getElementById(`${roomName}-current`).textContent = data.current + " A";
        document.getElementById(`${roomName}-power`).textContent = data.power + " W";
    });
}

function setupRoomDataUpdate(roomName) {
    var voltageSpan = document.getElementById(roomName + "-voltage");
    var currentSpan = document.getElementById(roomName + "-current");
    var powerSpan = document.getElementById(roomName + "-power");

    voltageSpan.addEventListener('input', function () {
        updateRoomData(roomName, parseFloat(voltageSpan.textContent.trim()), parseFloat(currentSpan.textContent.trim()), parseFloat(powerSpan.textContent.trim()));
    });

    currentSpan.addEventListener('input', function () {
        updateRoomData(roomName, parseFloat(voltageSpan.textContent.trim()), parseFloat(currentSpan.textContent.trim()), parseFloat(powerSpan.textContent.trim()));
    });

    powerSpan.addEventListener('input', function () {
        updateRoomData(roomName, parseFloat(voltageSpan.textContent.trim()), parseFloat(currentSpan.textContent.trim()), parseFloat(powerSpan.textContent.trim()));
    });
}

// ฟังก์ชันอัพเดตข้อมูลของห้อง
function updateRoomData(roomName, voltage, current, power) {
    database.ref('rooms/' + roomName).update({
        voltage: voltage,
        current: current,
        power: power
    }).then(() => {
        console.log('Data updated for ' + roomName);
    }).catch((error) => {
        console.error('Error updating data: ', error);
    });
}

// เพิ่มห้องใหม่ (สามารถแก้ไขให้เป็นการป้อนชื่อห้อง)
document.getElementById('add-room-btn').addEventListener('click', function () {
    var newRoomName = prompt("Enter new room name:");
    if (newRoomName) {
        createRoomBlock(newRoomName);
    }
});

// ตัวอย่างการเพิ่มห้องเริ่มต้น
createRoomBlock('room1');
createRoomBlock('room2');