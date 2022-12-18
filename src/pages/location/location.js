import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { ReactSortable } from 'react-sortablejs';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './location.module.scss';
import checkedIcon from '../../assets/icons/checked.svg';
import uncheckedIcon from '../../assets/icons/unchecked.svg';
import handleIcon from '../../assets/icons/handle.svg';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoid2xtY2hyc3RuIiwiYSI6ImNrOW01ZXN4NjFpZzgza3E2c20xMmNwd3cifQ.o1ZL2Dc21dA1mJLT9FEn-Q';

const LocationItem = ({ selectedItem, value, pushItem, popItem }) => {
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (selectedItem.includes(value)) {
            setSelected(true);
        }
    }, [selectedItem, value]);

    const handleSelected = () => {
        if (selected) {
            popItem(value);
        } else {
            pushItem(value);
        }
        setSelected(!selected);
    };

    return (
        <div className={classnames(styles.item, selected ? styles.selected : '')} onClick={() => handleSelected()}>
            <p className={styles['item-paragraph']}>{value.name}</p>
            <img className={styles['item-checkbox']} src={selected ? checkedIcon : uncheckedIcon} alt={'checkbox-icon'}/>
        </div>
    );
};

const DestinationItem = ({ value, setSortSelected }) => {
    const [items, setItems] = useState([]);

    useLayoutEffect(() => {
        let newItems = [];
        for (let i = 0; i < value.length; i++) {
            newItems.push({ id: i, name: value[i].name, coordinates: value[i].coordinates });
        }
        setItems(newItems);
    }, [value]);

    useEffect(() => {
        setSortSelected(items);
    }, [items, setSortSelected]);

    return (
        <ReactSortable list={items} setList={setItems} className={styles.sortable}>
            {items.map((item) => (
                <div key={item.id}>
                    <div className={styles['destination-item']}>
                        <div className={styles['destination-label']}>
                            {item.name}
                        </div>
                        <img className={styles['destination-icon']} src={handleIcon} alt={'destination-icon'} onClick={() => {console.log('item clicked')}}/>
                    </div>
                </div>
            ))}
        </ReactSortable>
    )
};

const MapItem = ({ item }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(104.0325121);
    const [lat, setLat] = useState(1.1294489);
    const [zoom, setZoom] = useState(17);
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom,
        });

        map.current.on('load', () => {
            for (let i = 0; i < item.length; i++) {
                let newCoordinates = coordinates;
                newCoordinates.push(item[i].coordinates)
                setCoordinates(newCoordinates);
            }
            console.log(coordinates);
            map.current.addSource('LineString', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coordinates
                    }
                }
            })
            map.current.addLayer({
                'id': 'LineString',
                'type': 'line',
                'source': 'LineString',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });
        })

        for (let i = 0; i < item.length; i++) {
            const marker = new mapboxgl.Marker().setLngLat(item[i].coordinates).setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h1>${item[i].name}</h1>`
                    )
                ).addTo(map.current);
            console.log(marker);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    useEffect(() => {
        if (!map.current) return;
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            })
        );
    }, []);

    return (
        <div>
            <div className={styles.sidebar}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className={styles.map} ></div>
        </div>
    )
};

const LocationPage = () => {
    const [step, setStep] = useState('Pick');
    const locationList = [
        {
            name: "Maha Vihara Duta Maitreya",
            coordinates: [
                104.03455436441709,
                1.129805363376306
            ]
        },
        {
            name: "Nagoya Hill Mall",
            coordinates: [
                104.01265636441673,
                1.1462299099665643
            ]
        },
        {
            name: "Mega Wisata Ocarina Batam",
            coordinates: [
                104.05542536441959,
                1.1524731833351467
            ]
        },
        {
            name: "Pantai Tanjung Pinggir",
            coordinates: [
                103.92413936441676,
                1.142452909946016
            ]
        },
        {
            name: "ONE Ice Skating Arena",
            coordinates: [
                104.04625145351372,
                1.1295276144286532
            ]
        },
        {
            name: "Pantai Marina",
            coordinates: [
                103.93247736441828,
                1.0821581826924245
            ]
        },
        {
            name: "Masjid Cheng Hoo",
            coordinates: [
                104.03886563557955,
                1.1655671834622439
            ]
        },
    ];

    const [selectedItem, setSelectedItem] = useState([]);

    const pushItem = (param) => {
        let newSelectedItem = selectedItem;
        newSelectedItem.push(param);
        setSelectedItem(newSelectedItem);
    }

    const popItem = (param) => {
        let newSelectedItem = selectedItem.filter(e => e !== param);
        setSelectedItem(newSelectedItem);
    }

    const handleMap = (param) => {
        return locationList.map((value, index) => {
            return <LocationItem key={index} selectedItem={param} value={value} pushItem={pushItem} popItem={popItem}/>;
        })
    }

    return (
        <section className={styles.root}>
            {step === 'Pick' ? (
                <>
                    <div className={styles.subtitle}>Pick Your</div>
                    <div className={styles.title}>Destination</div>
                    <div className={styles.desc}>Explore</div>
                    <div className={styles.category}>
                        {handleMap(selectedItem)}
                    </div>
                    <div className={styles['button-group']}>
                        <button className={classnames(styles.button, styles.next)} onClick={() => setStep('Sort')}>Next</button>
                    </div>
                </>
            ) : step === 'Sort' ? (
                <>
                    <div className={styles.subtitle}>Sort Your</div>
                    <div className={styles.title}>Destination</div>
                    <div className={styles.desc}>Next Destionation</div>
                    <div className={styles.category}>
                        <DestinationItem value={selectedItem} setSortSelected={setSelectedItem} />
                    </div>
                    <div className={styles['button-group']}>
                        <button className={styles.button} onClick={() => setStep('Pick')}>Prev</button>
                        <button className={classnames(styles.button, styles.next)} onClick={() => setStep('Map')}>Next</button>
                    </div>
                </>
            ) : (
                <MapItem item={selectedItem}/>
            )}
        </section>
    );
};

export default LocationPage;
