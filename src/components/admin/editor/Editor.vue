<template>
  <div class="main-container">
    <div
      class="editor-container editor-container_classic-editor"
      ref="editorContainerElement"
    >
      <div class="editor-container__editor">
        <div ref="editorElement">
          <!-- <ckeditor
            v-if="editor && config"
            :modelValue="config.initialData"
            :editor="editor"
            :config="config"
          /> -->
          <ckeditor
            v-if="editor && config"
            :editor="editor"
            :config="config"
            :model-value="modelValue"
            @update:model-value="onUpdate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watchEffect } from "vue";
import { Ckeditor, useCKEditorCloud } from "@ckeditor/ckeditor5-vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const onUpdate = (value) => {
  emit("update:modelValue", value);
};

const LICENSE_KEY =
  "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3OTY0Mjg3OTksImp0aSI6IjZjY2U1N2E3LTMxYjYtNDUxMC05ZjQ1LTVkZTk5M2M1NWIyYyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJyZW1vdmVGZWF0dXJlcyI6WyJQQiIsIlJGIiwiU0NIIiwiVENQIiwiVEwiLCJUQ1IiLCJJUiIsIlNVQSIsIkI2NEEiLCJMUCIsIkhFIiwiUkVEIiwiUEZPIiwiV0MiLCJGQVIiLCJCS00iLCJGUEgiLCJNUkUiXSwidmMiOiI4YWFjNDMyMyJ9.axN8y-6LgJbcZlkeICwFDzYti7xyrvdggq-5F2iz0wM4MIjUi9gpDcjbokrhx0kxVtzUu3KgFTmLbRMknm0hMg";

const CLOUD_SERVICES_TOKEN_URL =
  "https://myotuxdl09pc.cke-cs.com/token/dev/d258cd3e66617ba574ab34e2f59b8803e07877aebc5e85f6f5398cd85495?limit=10";

const cloud = useCKEditorCloud({
  version: "47.0.0",
  ckbox: { version: "2.6.1" },
});

const isLayoutReady = ref(false);

const editor = computed(() => {
  if (!cloud.data.value) {
    return null;
  }

  return cloud.data.value.CKEditor.ClassicEditor;
});

const config = computed(() => {
  if (!isLayoutReady.value) {
    return null;
  }

  if (!cloud.data.value) {
    return null;
  }

  const {
    Autosave,
    Essentials,
    Paragraph,
    Autoformat,
    ImageInsertViaUrl,
    ImageBlock,
    ImageToolbar,
    AutoImage,
    BlockQuote,
    Bold,
    CKBox,
    CloudServices,
    Link,
    ImageUpload,
    ImageInsert,
    PictureEditing,
    CKBoxImageEdit,
    Heading,
    ImageCaption,
    ImageInline,
    // ImageResize,
    ImageStyle,
    ImageTextAlternative,
    Indent,
    IndentBlock,
    Italic,
    LinkImage,
    List,
    // ListProperties,
    MediaEmbed,
    // PasteFromOffice,
    Table,
    TableToolbar,
    TableCaption,
    // TableCellProperties,
    // TableColumnResize,
    TableProperties,
    TextTransformation,
    TodoList,
    Underline,
    Emoji,
    Mention,
  } = cloud.data.value.CKEditor;

  return {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "emoji",
        "link",
        "insertImage",
        "ckbox",
        "mediaEmbed",
        "insertTable",
        "blockQuote",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Autoformat,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      CKBox,
      CKBoxImageEdit,
      CloudServices,
      Emoji,
      Essentials,
      Heading,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      // ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      // ListProperties,
      MediaEmbed,
      Mention,
      Paragraph,
      // PasteFromOffice,
      PictureEditing,
      Table,
      TableCaption,
      // TableCellProperties,
      // TableColumnResize,
      // TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
    ],
    cloudServices: {
      tokenUrl: CLOUD_SERVICES_TOKEN_URL,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
        "|",
        "ckboxImageEdit",
      ],
    },
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    mention: {
      feeds: [
        {
          marker: "@",
          feed: [
            /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
          ],
        },
      ],
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
  };
});

onMounted(() => {
  isLayoutReady.value = true;
});

watchEffect(() => {
  if (config.value) {
    configUpdateAlert(config.value);
  }
});
function configUpdateAlert(config) {
  if (configUpdateAlert.configUpdateAlertShown) {
    return;
  }

  const isModifiedByUser = (currentValue, forbiddenValue) => {
    if (currentValue === forbiddenValue) {
      return false;
    }

    if (currentValue === undefined) {
      return false;
    }

    return true;
  };

  const valuesToUpdate = [];

  configUpdateAlert.configUpdateAlertShown = true;

  if (!isModifiedByUser(config.licenseKey, "<YOUR_LICENSE_KEY>")) {
    valuesToUpdate.push("LICENSE_KEY");
  }

  if (
    !isModifiedByUser(
      config.cloudServices?.tokenUrl,
      "<YOUR_CLOUD_SERVICES_TOKEN_URL>"
    )
  ) {
    valuesToUpdate.push("CLOUD_SERVICES_TOKEN_URL");
  }

  if (valuesToUpdate.length) {
    window.alert(
      [
        "Please update the following values in your editor config",
        "to receive full access to Premium Features:",
        "",
        ...valuesToUpdate.map((value) => ` - ${value}`),
      ].join("\n")
    );
  }
}
</script>
