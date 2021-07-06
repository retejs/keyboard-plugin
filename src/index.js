function install(editor) {
    editor.view.container.focus();

    editor.on('keydown', e => {
        switch (e.code) {
        case 'Delete':
            editor.selected.each(n => editor.removeNode(n));
            break;

        case 'Space': // Spawn a context menu at the mouse position, but make sure it's inside the editor
            const mouse = editor.view.area.mouse;
            const rect = editor.view.container.getBoundingClientRect();
            const event = new MouseEvent('contextmenu', {
                clientX: clamp(mouse.x, rect.left, rect.right),
                clientY: clamp(mouse.y, rect.top, rect.bottom),
            });
            editor.trigger('contextmenu', { e: event, view: editor.view });
            break;

        default: break;
        }
    });
}

export default {
    install
}
