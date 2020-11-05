<template>
	<gmap-marker :position="this.coordinates"></gmap-marker>
</template>

<script>
export default {
	name: 'GoogleMarker',
	props: ['coordinates'],
};
</script>
