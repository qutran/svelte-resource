<script>
  export let getData;
  export let callback;

  $: value = getData();
</script>

{callback(value)}
