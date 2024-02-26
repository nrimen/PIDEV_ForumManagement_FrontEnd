import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorie } from '../../Core/Models/categorie';
import { blogService } from 'src/app/Service/blog-service';
import {createClient,SupabaseClient} from '@supabase/supabase-js';
import { supabase } from 'src/app/utils/supabase';



@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})


export class AddBlogComponent {
[x: string]: any;

private fileupload: File = {} as File;

  postForm!: FormGroup;
  categories = Object.values(Categorie);


  constructor(private fb: FormBuilder,private blogservice:blogService) { 
    
  }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['ss', ],
      content: ['ss', ],
      image: ['',],
      publishDate: ['', ],
      categorie: ['', ],
      comment: [null],
    });
  }



  /*onSubmit(){
    if (this.postForm.valid) {
      // Process the form data
      let article = this.postForm.value;
      console.log(this.postForm.value);
      this.blogservice.addArticle(article).subscribe();
      
    } else {
      // Form validation failed
      console.error('Form is invalid');
    }
  }*/

  async onSubmit() {
    if (this.postForm.valid) {
      // Process the form data
      let article = this.postForm.value;
      let filename = await this.uploadFile(this.fileupload);
      article.image = filename;
      console.log(article)
      this.blogservice.addArticle(article).subscribe();
      
    } else {
      // Form validation failed
      console.error('Form is invalid');
    }
  }


  async uploadFile(file: File) {
   

    

    const { data, error } = await supabase.storage.from('images').upload(`${Date.now()}_${file.name}`, file, { cacheControl: '3600', upsert: false });
    if (error) {
      console.error(error);
      return;
    }
    else
    {
      return data.path;
    }
  
  
  }

   onFileChanged = (event :any) => {
    console.log("here")
    const file = event.target.files[0];
    this.fileupload = file;
    //this.uploadFile(file);
  }

}
