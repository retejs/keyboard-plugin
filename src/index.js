import clone from 'lodash/clone';

function clamp(num, min, max) { return Math.min(Math.max(num, min), max); }

let copy = [];
let paste_count = 0;

function install(editor, options) {
    const { engine } = options;
    const offset = options.offset || 50;
    editor.view.container.focus();

    editor.on('keydown', e => {
        switch (e.code) {
        case 'Delete': // Delete a node
            if (engine) await engine.abort();
            editor.selected.each(n => editor.removeNode(n));
            break;

        case 'Space':
            let rect = editor.view.container.getBoundingClientRect();
            let event = new MouseEvent('contextmenu', {
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });

            editor.trigger('contextmenu', { e: event, view: editor.view });
            break;

        case 'c': // Copy a node
            if (!e.ctrlKey) break;
            paste_count = 0;
            copy = { 'nodes': new Map(), 'edges': [] };
            for (const n of editor.selected.list) {
                copy.nodes.set(n.id, { 'name': n.name, 'position': clone(n.position), 'data': n.data });
            }
            for (const n of editor.selected.list) {
                for (const [to_key, to] of n.inputs) {
                    for (const con of to.connections) {
                        const from = con.output;
                        copy['edges'].push({ 'to': { 'id': to.node.id, 'socket': to_key, 'data': to.data },
                                             'from': { 'id': from.node.id, 'socket': from.key, 'data': from.data }});
                    }
                }
            }
            break;

        case 'v': // Copy a node
            if (!e.ctrlKey) break;
            editor.selected.clear();
            let added_nodes = new Map();
            for (const [id, {name, position, data}] of copy.nodes) {
                // If the node still exists
                console.log(data);
                let n = await engine.components.get(name).createNode(data);
                added_nodes.set(id, n);
                const new_position = (editor.nodes.find(n => n.id == id)?.position) || position;
                n.position = [new_position[0] + offset * (paste_count + 1), new_position[1] + offset * (paste_count + 1)];
                editor.addNode(n);
                editor.selected.add(n, true);
            }
            editor.trigger('process');

            for (const {from, to} of copy.edges) {
                const new_target = added_nodes.get(to.id);
                // Find the node where to start connections from
                const from_node = added_nodes.get(from.id) /* copied node */
                      || editor.nodes.find(n => n.id == from.id) /* existing node */;
                if (from_node !== undefined) {
                    editor.connect(from_node.outputs.get(from.socket), new_target.inputs.get(to.socket));
                }
            }

            ++paste_count;
            break;
        default: break;
        }
    });
}

export default {
    install
}
