# Image Annotation Design

## Goal

Make image annotation feel reliable and useful inside ProjectChat.

## Scope

- Open image editing with drawing enabled by default.
- Support pen, line, arrow, rectangle, circle, and emoji stamps.
- Keep undo, clear, zoom, color, and brush size controls.
- Save sent-image annotations locally per user and message.
- Avoid new dependencies and keep image data in the existing canvas flow.

## Notes

- The current viewer opens with drawing disabled, which makes the feature look broken.
- Shape previews should restore the canvas snapshot while dragging, then commit on release.
- Emoji stamps should be one-click annotations and participate in undo.
