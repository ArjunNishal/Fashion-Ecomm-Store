import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import React, { useState } from "react";

const CkeditorComponent = ({
  content,
  setcontent,
  setuploadedImagesarr,
}) => {
  // console.log(content, "content of the article");

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, setuploadedImagesarr);
    };
  }

  class MyUploadAdapter {
    constructor(loader, setuploadedImagesarr) {
      this.loader = loader;
      this.setuploadedImagesarr = setuploadedImagesarr;
    }

    async upload() {
      const file = await this.loader.file;

      try {
        const url = URL.createObjectURL(file);
        // console.log(file, url, "555555555555555555555555555555555");
        // const url = response.data.url;
        this.setuploadedImagesarr((prev) => [...prev, file]);
        return { default: url };
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    }

    abort() {}
  }
  return (
    <CKEditor
      editor={Editor}
      data={content}
      onChange={(event, editor) => {
        const data = editor.getData();
        setcontent(data);
      }}
      style={{ width: "100%" }}
      config={{
        extraPlugins: [MyCustomUploadAdapterPlugin],
        height: "300px",
      }}
    />
  );
};

export default CkeditorComponent;
