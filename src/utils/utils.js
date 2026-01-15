// Image Handler
export function handleImageClick(name, link, popupInstance) {
  popupInstance.open(name, link);
}

// Delete Confirmation Handler
export function handleDeleteConfirmation(popupInstance, onConfirm) {
  popupInstance.open(onConfirm);
}
