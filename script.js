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
        <p id="${roomName}-status" class="status-value">OFF</p> 
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
        updateRoomStatus(roomName, data);
    });
}

function updateRoomStatus(roomName, data) {
    var statusSpan = document.getElementById(roomName + "-status");
    if (data && data.voltage > 0) { // ตรวจสอบว่ามีข้อมูลและ voltage มากกว่า 0
        statusSpan.textContent = "ON";
        statusSpan.style.color = "green"; 
    } else {
        statusSpan.textContent = "OFF";
        statusSpan.style.color = "red";
    }
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
    database.ref('rooms/' + roomName).set({
        voltage: voltage,
        current: current,
        power: power
    }).then(() => {
        console.log('Data updated for ' + roomName);
    }).catch((error) => {
        console.error('Error updating data: ', error);
    });
}

// ฟังก์ชันเพิ่มห้องใหม่
document.getElementById('add-room-form').addEventListener('submit', function (event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ

    var newRoomName = document.getElementById('new-room-name').value;
    if (newRoomName) {
        // เพิ่มข้อมูลห้องใหม่ใน Firebase
        database.ref('rooms/' + newRoomName).set({
            voltage: 0, // ค่าเริ่มต้นสำหรับ voltage
            current: 0, // ค่าเริ่มต้นสำหรับ current
            power: 0 // ค่าเริ่มต้นสำหรับ power
        }).then(() => {
            console.log('New room added: ' + newRoomName);
            // สร้างบล็อกห้องใน frontend
            createRoomBlock(newRoomName);
            document.getElementById('add-room-form').reset(); // ล้างค่าในฟอร์ม
        }).catch((error) => {
            console.error('Error adding new room: ', error);
        });
    }
});

// ตัวอย่างการเพิ่มห้องเริ่มต้น
createRoomBlock('room1');
createRoomBlock('room2');