export const cvRoutes = ['/cv', '/cv2', '/cv3', '/cv4', '/cv5', '/cv6', '/cv7'];

export const getNextRoute = (currentRoute) => {
  const currentIndex = cvRoutes.indexOf(currentRoute);
  return currentIndex < cvRoutes.length - 1 ? cvRoutes[currentIndex + 1] : null;
};