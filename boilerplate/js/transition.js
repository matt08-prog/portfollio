export function moveRight(self) {
  if (!self.transition) {
    console.log("left click", self.texts.length);
    self.transition = true;

    const originCoords = {
      x: self.origin.x,
      y: self.origin.y,
      z: self.origin.z,
    }; // Start at (0, 0)
    const centerCoords = { x: 1.5, y: 0, z: 0 };

    self.tween = new TWEEN.Tween(originCoords) // Create a new tween that modifies 'coords'.
      .to({ x: 1.5, y: 0, z: 0 }, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        //console.log(coords);
        self.slides[self.slideIndex].position.set(
          originCoords.x,
          originCoords.y,
          originCoords.z
        );

        self.texts[self.slideIndex].position.set(
          originCoords.x - 3,
          originCoords.y,
          originCoords.z
        );
      })
      .onComplete(() => {
        self.slideIndex++;
        if (self.slideIndex > self.slides.length - 1) {
          self.slideIndex = 0;
        }
        console.log("done!", self.slideIndex);
        self.transition = false;
        self.first = false;
      })
      .start(); // Start the tween immediately.

    self.tween1 = new TWEEN.Tween(centerCoords) // Create a new tween that modifies 'coords'.
      .to({ x: 5, y: 0, z: 0 }, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        console.log("move out", self.slideIndex);
        if (self.slideIndex > 0 && self.transition) {
          self.slides[self.slideIndex - 1].position.set(
            centerCoords.x,
            centerCoords.y,
            centerCoords.z
          );
        } else if (
          self.slideIndex == 0 &&
          self.transition &&
          self.first == false
        ) {
          self.slides[1].position.set(
            centerCoords.x,
            centerCoords.y,
            centerCoords.z
          );
        }
      })
      .onComplete(() => {
        self.transition = false;
      })
      .start(); // Start the tween immediately.

    const rightCoords = { x: 1.5 - 3, y: 0, z: 0 };
    self.tween2 = new TWEEN.Tween(rightCoords) // Create a new tween that modifies 'coords'.
      .to({ x: 5, y: 0, z: 0 }, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        console.log("move out", self.slideIndex);
        if (self.slideIndex > 0 && self.transition) {
          self.texts[self.slideIndex - 1].position.set(
            rightCoords.x,
            rightCoords.y,
            rightCoords.z
          );
        } else if (
          self.slideIndex == 0 &&
          self.transition &&
          self.first == false
        ) {
          self.texts[1].position.set(
            rightCoords.x,
            rightCoords.y,
            rightCoords.z
          );
        }
      })
      .onComplete(() => {
        self.transition = false;
      })
      .start(); // Start the tween immediately.
  }
}

export function moveLeft(self) {
  if (!self.transition) {
    console.log("left click");
    self.transition = true;

    const originCoords = {
      x: self.origin.x,
      y: self.origin.y,
      z: self.origin.z,
    }; // Start at (0, 0)
    const centerCoords = { x: 1.5, y: 0, z: 0 };
    const rightCoords = { x: 5, y: 0, z: 0 };

    self.tween = new TWEEN.Tween(rightCoords) // Create a new tween that modifies 'coords'.
      .to({ x: 1.5, y: 0, z: 0 }, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        //console.log(coords);
        self.slides[self.slideIndex].position.set(
          rightCoords.x,
          rightCoords.y,
          rightCoords.z
        );

        self.texts[self.slideIndex].position.set(
          rightCoords.x - 3,
          rightCoords.y,
          rightCoords.z
        );
      })
      .onComplete(() => {
        self.slideIndex--;
        if (self.slideIndex < 0) {
          self.slideIndex = self.slides.length - 1;
        }
        console.log("done!", self.slideIndex);
        self.transition = false;
        self.first = false;
      })
      .start(); // Start the tween immediately.
    if (!self.first) {
      self.tween1 = new TWEEN.Tween(centerCoords) // Create a new tween that modifies 'coords'.
        .to({ x: -10, y: 0, z: 0 }, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
          console.log("move out", self.slideIndex, self.first);
          if (self.slideIndex > 0 && self.transition) {
            self.slides[self.slideIndex - 1].position.set(
              centerCoords.x,
              centerCoords.y,
              centerCoords.z
            );

            self.texts[self.slideIndex - 1].position.set(
              centerCoords.x,
              centerCoords.y,
              centerCoords.z
            );
          } else if (
            self.slideIndex == 0 &&
            self.transition &&
            self.first == false
          ) {
            self.slides[1].position.set(
              centerCoords.x,
              centerCoords.y,
              centerCoords.z
            );

            self.texts[1].position.set(
              centerCoords.x,
              centerCoords.y,
              centerCoords.z
            );
          }
        })
        .onComplete(() => {
          self.transition = false;
        })
        .start(); // Start the tween immediately.
    }
  }
}
