import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PlanComponent } from './plan/plan.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { WorkoutsModule } from './workouts/workouts.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { MatNativeDateModule } from '@angular/material';
import { TopMenuComponent } from './shared/components/top-menu/top-menu.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent, PlanComponent, TopMenuComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(ROUTES, { useHash: false }),
        CoreModule.forRoot(),
        WorkoutsModule,
        HttpClientModule,
        MatNativeDateModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
