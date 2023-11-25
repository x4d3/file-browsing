import {useState} from 'preact/hooks';
import files from './files.json';

import {Fragment} from 'preact';
import {debounce} from "./debounce";

const convertFolder = (name, json, path = null) => {
    const children = Object.entries(json).map(([key, value]) => {
        return convertFolder(key, value, path ? `${path}/${key}` : key);
    })
    const normalisedPath = path ? normalizeString(path.toLowerCase()) : "";
    return {name, path, normalisedPath, children, isOpen: false};
}

const getOpenedFolders = (paths, folder, normalisedFilter) => {
    let isOpen = false;
    folder.children.forEach(child => {
        isOpen = getOpenedFolders(paths, child, normalisedFilter) || isOpen
    });
    if (isOpen || folder.normalisedPath.includes(normalisedFilter)) {
        paths.add(folder.normalisedPath);
        return true
    } else {
        return false;
    }
}

const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
};

const Folder = ({folder, filterResult}) => {
    const {name, children} = folder;
    let [isOpen, setIsOpen] = useState(false);
    if (filterResult) {
        isOpen = filterResult.has(folder.normalisedPath);
        if (!isOpen) {
            return (<Fragment/>);
        }
    }
    const toggleFolder = () => {
        setIsOpen(!isOpen);
    };

    return (<li>
        <span className={"folder"} onClick={toggleFolder}>{isOpen ? "📂" : "📁"} {name}</span>
        <ul>
            {isOpen && children.map((child, index) => (
                <TreeNode key={index}
                          data={child}
                          filterResult={filterResult}/>
            ))}
        </ul>
    </li>);
};

const File = ({data}) => (<li><a href={data.path} class="file">{data.name}</a></li>);

const TreeNode = ({data, filterResult, setOpenedFolders}) => {
    return data.children.length > 0 ? <Folder folder={data} filterResult={filterResult}/> : <File data={data}/>;
};

export const PDFViewer = () => {
    const root = convertFolder('root', files)

    const [filterResult, setFilterResult] = useState(null);

    const handleFilterChange = debounce((event) => {
        const filterValue = event.target.value.trim().toLowerCase();
        if (filterValue.length < 3) {
            setFilterResult(null);
            return
        }
        const opened = new Set();
        getOpenedFolders(opened, root, normalizeString(filterValue).toLowerCase());
        setFilterResult(opened);
    });

    return (<div>
        <input
            type="text"
            placeholder="Filter by title"
            onInput={handleFilterChange}
        />
        <div class="tree">
            <ul>
                {root.children.map((folder, index) => (
                    <Folder key={index} folder={folder} filterResult={filterResult}/>)
                )}
            </ul>
        </div>
    </div>);
};
