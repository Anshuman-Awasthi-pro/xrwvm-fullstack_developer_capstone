# Uncomment the following imports before adding the Model code
from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

# Create a Car Make model
class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    # Other fields can be added here as needed

    def __str__(self):
        return self.name  # Return the name as the string representation

# Create a Car Model model
class CarModel(models.Model):
    # Many-To-One relationship to Car Make model
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    
    # Dealer ID (IntegerField) refers to a dealer created in Cloudant database
    dealer_id = models.IntegerField()
    
    name = models.CharField(max_length=100)
    
    # Type choices
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    CAR_TYPES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
        # Add more choices as required
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default=SUV)
    
    # Year with validators
    year = models.IntegerField(default=2023,
        validators=[
            MaxValueValidator(2023),
            MinValueValidator(2015)
        ])

    def __str__(self):
        return self.name  # Return the name as the string representation