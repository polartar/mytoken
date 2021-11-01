export const onError = ( error: Error ) => {
  alert(
    `Failed to load web3, Check console for details.`,
  );
  console.error( error );
};