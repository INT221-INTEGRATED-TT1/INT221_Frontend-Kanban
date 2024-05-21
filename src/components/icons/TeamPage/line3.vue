<template>
    <svg id="ex6" width="329" height="51" viewBox="0 0 329 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.14648 16.6367C27.504 18.6386 51.4245 22.0417 75.951 22.261C120.434 22.6589 165.216 20.6379 209.582 17.8865C247.345 15.5446 285.839 11.7579 322.799 3.20063C324.564 2.79192 328.603 0.581396 325.611 2.5757" stroke="white" stroke-width="3" stroke-linecap="round"/>
<path d="M2.20898 48.5083C26.8224 48.5083 51.443 48.6847 76.0551 48.4042C109.011 48.0286 141.935 46.2185 174.898 47.2585C202.315 48.1235 229.218 51.0461 256.556 47.1022C275.931 44.3071 295.197 39.35 314.362 35.3848" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>

</template>
<style>
@keyframes drawLine {
    0% {
        stroke-dasharray: 0, 1000;
    }
    100% {
        stroke-dasharray: 1000, 0;
    }
}

#ex6 path {
    animation: drawLine 1s ease-in forwards;
}
</style>