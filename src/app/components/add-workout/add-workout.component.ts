import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Workout {
  type: string;
  minutes: number;
}

interface UserData {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './add-workout.component.html',
  styleUrl: './add-workout.component.css',
})
export class AddWorkoutComponent implements OnInit {
  
  workoutForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required, Validators.min(1), Validators.max(500)]),
    type: new FormControl('Gym', [Validators.required]),
  });

  userData: UserData[] | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedData: UserData[] = JSON.parse(localStorage.getItem('userData') || '[]');
    this.userData = storedData.length ? storedData : null;
  }

  onSubmit() {
    // Check if the form is valid before proceeding
    if (this.workoutForm.invalid) {
      alert('⚠️ All fields must be filled correctly before submitting.');
      return;
    }

    const formValue = this.workoutForm.value;
    console.warn('Form Submitted:', formValue);

    // Retrieve existing userData from localStorage
    const storedData = localStorage.getItem('userData');
    let userData: UserData[] = storedData ? JSON.parse(storedData) : [];

    let user = userData.find((u) => u.name === formValue.name);
    
    if (!user) {
      user = {
        id: userData.length + 1,
        name: formValue.name!,
        workouts: [],
      };
      userData.push(user);
    }

    user.workouts.push({
      type: formValue.type!,
      minutes: parseInt(formValue.duration ?? '0', 10),
    });

    // Save updated data back to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirect to explore page
    this.router.navigate(['/explore']);
  }
}
