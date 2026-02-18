-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 13, 2026 at 07:54 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fiszki`
--
CREATE DATABASE IF NOT EXISTS `fiszki` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `fiszki`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `fiszki`
--

CREATE TABLE `fiszki` (
  `id` int(2) NOT NULL,
  `slowo` varchar(15) DEFAULT NULL,
  `definicja` varchar(58) DEFAULT NULL,
  `zdanie` varchar(56) DEFAULT NULL,
  `groupid` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `fiszki`
--

INSERT INTO `fiszki` (`id`, `slowo`, `definicja`, `zdanie`, `groupid`) VALUES
(1, 'Fotosynteza', 'Proces, w którym rośliny przekształcają światło w energię.', 'Rośliny wykorzystują fotosyntezę do wzrostu.', 1),
(2, 'Grawitacja', 'Siła przyciągająca obiekty do siebie.', 'Grawitacja sprawia, że stoimy na ziemi.', 1),
(3, 'Atom', 'Najmniejsza jednostka budująca materię.', 'Wszystko wokół nas składa się z atomów.', 1),
(4, 'Ekosystem', 'Zespół organizmów i ich środowisko.', 'Las jest złożonym ekosystemem.', 1),
(5, 'Demokracja', 'Ustrój, w którym władzę sprawuje naród.', 'W demokracji obywatele wybierają swoich przedstawicieli.', 1),
(6, 'Ewolucja', 'Proces stopniowych zmian gatunków.', 'Ewolucja tłumaczy różnorodność życia na Ziemi.', 2),
(7, 'Układ słoneczny', 'Zbiór planet krążących wokół Słońca.', 'Ziemia jest częścią Układu Słonecznego.', 2),
(8, 'Internet', 'Globalna sieć łącząca komputery na całym świecie.', 'Korzystamy z Internetu każdego dnia.', 2),
(9, 'Obieg wody', 'Ciągły cykl krążenia wody na Ziemi.', 'Deszcz jest elementem obiegu wody.', 2),
(10, 'Energia', 'Zdolność do wykonania pracy lub wywołania zmiany.', 'Prąd elektryczny jest formą energii.', 2);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `groups`
--

CREATE TABLE `groups` (
  `id` int(1) NOT NULL,
  `nazwa` varchar(15) DEFAULT NULL,
  `userid` int(1) DEFAULT NULL,
  `private` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `nazwa`, `userid`, `private`) VALUES
(1, 'Pytania testowe', 1, 'false'),
(2, 'TEST', 1, 'false');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(1) NOT NULL,
  `nazwa` text NOT NULL,
  `email` varchar(8) DEFAULT NULL,
  `haslo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nazwa`, `email`, `haslo`) VALUES
(1, 'Test', 'bajojajo', '$2b$10$t4I7xiA7DO2g0z1UYKNT3.8dTUafzgrMStF0t5MHAGWfjK.demEg6'),
(2, 'test2', 'brak', '$2b$10$aAygV2osgP7JYbza5UaQ3eSIbfY0QBDqnHnuyX9mxgtYDdtejNMT2'),
(3, 'Test3', 'brak', '$2b$10$mM9eic.ss7gBHLpmv74NBuqOLDHqbm4/cna3oHl.6wsKNqtOyFrOK');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `fiszki`
--
ALTER TABLE `fiszki`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groupid` (`groupid`);

--
-- Indeksy dla tabeli `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nazwa` (`nazwa`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `groups`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fiszki`
--
ALTER TABLE `fiszki`
  ADD CONSTRAINT `fiszki_ibfk_1` FOREIGN KEY (`groupid`) REFERENCES `groups` (`id`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
