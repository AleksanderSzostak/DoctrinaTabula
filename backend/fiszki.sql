-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 19, 2026 at 07:22 PM
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
  `slowo` text DEFAULT NULL,
  `definicja` text DEFAULT NULL,
  `zdanie` text DEFAULT NULL,
  `groupid` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `fiszki`
--

INSERT INTO `fiszki` (`id`, `slowo`, `definicja`, `zdanie`, `groupid`) VALUES
(103, 'to cease', 'to stop', 'The rain finally ceased.', 1),
(104, 'to reside', 'to live', 'They reside in the city center.', 1),
(105, 'to terminate / complete', 'to bring to an end', 'The contract was terminated early.', 1),
(106, 'promote', 'to raise or move to a higher grade, rank, or job; to advocate', 'He was promoted last year.', 1),
(107, 'sufficient', 'enough', 'We have sufficient time.', 1),
(108, 'to function', 'work or operate in a proper or particular way', 'The device does not function properly.', 1),
(109, 'to liberate / release', 'to free', 'The prisoners were released.', 1),
(110, 'considerable', 'large / big (of knowledge / effort)', 'He has considerable experience.', 1),
(111, 'enormous', 'big / large', 'They faced enormous pressure.', 1),
(112, 'to correct / regulate / revamp', 'to fix', 'The company fixed the system error.', 1),
(113, 'to depart', 'to go / leave', 'The bus will depart at noon.', 1),
(114, 'to consume', 'to eat / to use up', 'This car consumes little fuel.', 1),
(115, 'quality / excellent / superb / satisfactory / decent', 'good', 'The service was excellent.', 1),
(116, 'be instrumental in', 'contribute to sth the most', 'She was instrumental in the success.', 1),
(117, 'to desire', 'to want / to long for what is absent or lost', 'He desires a better future.', 1),
(118, 'to commence', 'to begin / to start', 'The class will commence soon.', 1),
(119, 'to demonstrate', 'to show', 'The teacher demonstrated the experiment.', 1),
(120, 'to dispose of / discard', 'to throw away', 'Please dispose of the trash.', 1),
(121, 'nefarious / unbecoming', '(of behaviour) bad', 'He was known for nefarious acts.', 1),
(122, 'thrilled / ecstatic / joyful', 'happy', 'She was thrilled with the results.', 1),
(123, 'foster', 'to promote, encourage (e.g. understanding, dialogue)', 'The program fosters dialogue.', 1),
(124, 'to provide / deliver / supply', 'to give', 'The school provides meals.', 1),
(125, 'initially', 'at first, originally, primarily, in the beginning', 'Initially, the task was difficult.', 1),
(126, 'exasperated', 'annoyed', 'She was exasperated by the delay.', 1),
(127, 'essential / vital / crucial / significant', 'important', 'Sleep is essential for health.', 1),
(128, 'insane', 'crazy', 'That idea sounds insane.', 1),
(129, 'render sth (impossible, speechless, etc.)', 'make, cause', 'The news rendered her speechless.', 1),
(130, 'to employ / take advantage of / deploy / apply', 'to use', 'He employed a new method at work.', 1),
(131, 'approval (of sth)', 'green light', 'The project received approval.', 1),
(132, 'costly', 'expensive', 'The repairs were costly.', 1),
(133, 'pervasive', 'common', 'Smartphones are pervasive today.', 1),
(134, 'to obtain / acquire / gain', 'to get', 'She obtained a new job.', 1),
(135, 'subsequently', 'later / next', 'Subsequently, he changed his mind.', 1),
(136, 'dreadful / atrocious', 'bad', 'The weather was dreadful.', 1),
(137, 'comprehension', 'understanding', 'Reading improves comprehension.', 1),
(138, 'somber / pessimistic', 'sad', 'The atmosphere was somber.', 1),
(139, 'to occur', 'to happen', 'The accident occurred yesterday.', 1),
(140, 'to appear', 'to seem', 'He appears tired today.', 1),
(141, 'to retain', 'to hold or keep', 'She tried to retain all the information.', 1),
(142, 'complete / entire', 'whole', 'She read the entire book.', 1),
(143, 'generate / yield', 'cause', 'The decision generated a lot of debate.', 1),
(144, 'deficiency', 'a lack or shortage', 'A vitamin deficiency can cause illness.', 1),
(145, 'inexpensive / affordable', 'cheap', 'The meal was inexpensive.', 1),
(146, 'principally', 'mainly', 'The book is principally about history.', 1),
(147, 'vacant / available', 'free / empty', 'The room is vacant.', 1),
(148, 'to enquire', 'to ask', 'She called to enquire about the course.', 1),
(149, 'exceptional / improved', 'better', 'His performance was exceptional.', 1),
(150, 'immature / infantile', 'childish or silly', 'His behavior was immature.', 1),
(151, 'clarification', 'explanation', 'I asked for clarification.', 1),
(152, 'to transpire', 'to turn out', 'It transpired that he was correct.', 1),
(153, 'amiable', 'friendly / pleasant', 'He has an amiable personality.', 1),
(154, 'to assist / aid / support', 'to help', 'She assisted her friend with homework.', 1),
(155, 'incorrect', 'wrong', 'Your answer is incorrect.', 1),
(156, 'residence', 'home / house', 'This is her permanent residence.', 1);

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
(1, 'Formal-Informal', 1, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(1) NOT NULL,
  `nazwa` text NOT NULL,
  `email` varchar(8) DEFAULT NULL,
  `haslo` text DEFAULT NULL,
  `tokenVersion` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nazwa`, `email`, `haslo`, `tokenVersion`) VALUES
(1, 'Test', 'bajojajo', '$2b$10$t4I7xiA7DO2g0z1UYKNT3.8dTUafzgrMStF0t5MHAGWfjK.demEg6', 3),
(2, 'test2', 'brak', '$2b$10$aAygV2osgP7JYbza5UaQ3eSIbfY0QBDqnHnuyX9mxgtYDdtejNMT2', 0),
(3, 'Test3', 'brak', '$2b$10$mM9eic.ss7gBHLpmv74NBuqOLDHqbm4/cna3oHl.6wsKNqtOyFrOK', 0);

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
-- AUTO_INCREMENT for table `fiszki`
--
ALTER TABLE `fiszki`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fiszki`
--
ALTER TABLE `fiszki`
  ADD CONSTRAINT `fiszki_ibfk_1` FOREIGN KEY (`groupid`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
