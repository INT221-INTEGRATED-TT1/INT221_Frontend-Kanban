<template>
    <div>
        <div class="container" @contextmenu.prevent="showDropdown">
            Right click here
            <div v-if="isDropdownVisible" class="dropdown">
                <!-- Dropdown content -->
                <!-- ส่วนนี้คือ dropdown content ที่ต้องการแสดง -->
                <ul>
                    <li>Delete</li>
                    <!-- <li>Option 2</li>
            <li>Option 3</li> -->
                </ul>
            </div>
        </div>
    </div>
    <label> EZ
    <select v-model="selectedOption">
        <option disabled value="">Please select one</option>
        <option selected>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    </label>
</template>

<script setup>
import { ref } from 'vue';

const isDropdownVisible = ref(false);

// เมื่อคลิกที่ส่วนอื่น ๆ ในเอกสาร
document.addEventListener('click', (event) => {
    if (!event.target.closest('.container')) {
        isDropdownVisible.value = false;
    }
});

// เมื่อคลิกขวาที่ container
const showDropdown = () => {
    isDropdownVisible.value = true;
};
const selectedOption = ref('ds'); // เลือกค่าเริ่มต้นเป็น 'A'
</script>

<style scoped>
.container {
    position: relative;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 999;
    /* ให้ dropdown อยู่ด้านบนสุด */
}
</style>