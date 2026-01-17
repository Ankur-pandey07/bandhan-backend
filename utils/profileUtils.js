function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateCompletion(profile) {
  let percent = 0;

  if (profile.photos?.length >= 2) percent += 30;
  if (profile.bio?.length >= 30) percent += 20;
  if (profile.fullName && profile.gender && profile.location) percent += 25;
  if (profile.interests?.length > 0) percent += 15;
  if (profile.reel) percent += 10;

  return percent;
}

module.exports = { calculateAge, calculateCompletion };
